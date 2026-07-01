import { ApiError } from "../utils/ApiError.js";
import Submission from "../models/submission.model.js";
import Problem from "../models/problem.model.js";
import ContestParticipant from "../models/contestParticipant.model.js";
import Contest from "../models/contest.model.js";
import Docker from "dockerode";
import fs from "fs";
import path from "path";
import { updateContestParticipant } from "./contest.service.js";

const docker = new Docker();

const submissionUpdateHelper = async (
    {
        submission,
        verdict,
        status,
        contestId,
        contestParticipantId,
        executionTime = null
    }
) => {

    submission.status = status;
    submission.verdict = verdict;
    if (executionTime !== null) {
        submission.executionTime = executionTime;
    }

    await submission.save();

    if (contestId && contestParticipantId) {
        await updateContestParticipant(submission._id, contestId, contestParticipantId);
    }
}

export const judgeSubmission = async (
    {
        submissionId,
        contestId,
        contestParticipantId
    }
) => {
    const submission = await Submission.findById(submissionId);

    console.log("Judging submission:", submissionId);

    if (!submission) {
        throw new ApiError(404, "Submission not found.");
    }

    // Fetch the problem details to get time and memory limits
    const problem = await Problem.findById(submission.problem);

    if (!problem) {
        throw new ApiError(404, "Problem not found.");
    }

    const memorylimit = problem.memorylimit; // MB

    submission.status = "Judging";
    await submission.save();

    let container;

    try {

        container = await docker.createContainer({
            Image: "gcc:latest",

            Cmd: [
                "tail", "-f", "/dev/null"
            ],

            Tty: false,

            HostConfig: {
                Memory: memorylimit * 1024 * 1024
            },

            AttachStdout: true,
            AttachStderr: true
        });

        await container.start();

        // Compile the code inside the container
        const exec = await container.exec({
            Cmd: [
                "sh",
                "-c",
                `cat << EOF > main.cpp
${submission.code}
EOF

g++ main.cpp -o main`
            ],
            AttachStdout: true,
            AttachStderr: true
        });

        const stream = await exec.start();

        let compileOutput = "";

        stream.on("data", (data) => {
            compileOutput += data.toString();
        });

        await new Promise((resolve) => {
            stream.on("end", resolve);
        });

        const compileResult = await exec.inspect();

        if (compileResult.ExitCode !== 0) {
            await submissionUpdateHelper(
                {
                    submission,
                    verdict: "Compilation Error",
                    status: "Completed",
                    contestId,
                    contestParticipantId
                }
            );
            return;
        }


        // loop through storage/testcases/<problemId>/ and execute the compiled code with each test case and compare the output with the expected output
        const testcasesDir = path.join(process.cwd(), "storage", "testcases", submission.problem.toString());
        const testcases = fs.readdirSync(testcasesDir)
            .filter(file => file.startsWith("input"))
            .sort();

        let allPassed = true;

        let maxTime = 0;

        for (const testcase of testcases) {
            let input = "";
            let expectedOutput = "";
            try {
                input = fs.readFileSync(path.join(testcasesDir, testcase), "utf-8");
                expectedOutput = fs.readFileSync(path.join(testcasesDir, testcase.replace("input", "output")), "utf-8").trim();
            }
            catch (err) {
                await submissionUpdateHelper(
                    {
                        submission,
                        verdict: "Runtime Error",
                        status: "Failed",
                        contestId,
                        contestParticipantId
                    }
                );
                return;
            }

            const timelimit = problem.timelimit / 1000; // seconds

            const start = Date.now();
            const exec = await container.exec({
                Cmd: [
                    "sh",
                    "-c",
                    `timeout ${timelimit}s sh -c "printf '%s' '${input}' | ./main"`
                ],
                AttachStdout: true,
                AttachStderr: true
            });

            const stream = await exec.start();

            let stdout = "";
            let stderr = "";

            docker.modem.demuxStream(
                stream,
                {
                    write: (chunk) => {
                        stdout += chunk.toString();
                    }
                },
                {
                    write: (chunk) => {
                        stderr += chunk.toString();
                    }
                }
            );

            await new Promise((resolve) => {
                stream.on("end", resolve);
            });

            const runResult = await exec.inspect();

            if (runResult.ExitCode === 137) {
                await submissionUpdateHelper(
                    {
                        submission,
                        verdict: "Memory Limit Exceeded",
                        status: "Completed",
                        contestId,
                        contestParticipantId
                    }
                );
                return;
            }

            if (runResult.ExitCode === 124) {

                await submissionUpdateHelper(
                    {
                        submission,
                        verdict: "Time Limit Exceeded",
                        status: "Completed",
                        contestId,
                        contestParticipantId
                    }
                );
                return;
            }

            if (runResult.ExitCode !== 0) {

                await submissionUpdateHelper(
                    {
                        submission,
                        verdict: "Runtime Error",
                        status: "Completed",
                        contestId,
                        contestParticipantId
                    }
                );
                return;
            }

            const end = Date.now();

            maxTime = Math.max(maxTime, end - start);

            const output = stdout.trim();

            console.log("Running testcase:", testcase);
            console.log("Expected:", JSON.stringify(expectedOutput));
            console.log("Actual:", JSON.stringify(output));

            if (output !== expectedOutput) {
                allPassed = false;
                break;
            }

            console.log("Finished testcase:", testcase);
        }
        console.log("Finish all testcases!!");


        await submissionUpdateHelper(
            {
                submission,
                verdict: allPassed ? "Accepted" : "Wrong Answer",
                status: "Completed",
                contestId, contestParticipantId,
                executionTime: maxTime
            }
        );

    }
    catch (error) {

        console.error(
            "Judge Error:",
            error
        );

        await submissionUpdateHelper(
            {
                submission,
                verdict: "Runtime Error",
                status: "Failed",
                contestId,
                contestParticipantId
            }
        );


    }
    finally {

        try {

            if (container) {
                await container.remove({
                    force: true
                });
            }

        }
        catch { }

    }

};