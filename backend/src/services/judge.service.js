import { ApiError } from "../utils/ApiError.js";
import Submission from "../models/submission.model.js";
import Problem from "../models/problem.model.js";
import Docker from "dockerode";
import fs from "fs";
import path from "path";

const docker = new Docker();

export const judgeSubmission = async (submissionId) => {

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
        
        console.log("Compile Output:");
        console.log(compileOutput);

        const compileResult = await exec.inspect();
        console.log("Compilation result :\n", compileResult);

        if (compileResult.ExitCode !== 0) {
            submission.status = "Completed";
            submission.verdict = "Compilation Error";
            await submission.save();
            return;
        }


        // loop through storage/testcases/<problemId>/ and execute the compiled code with each test case and compare the output with the expected output
        const testcasesDir = path.join(process.cwd(), "storage", "testcases", submission.problem.toString());
        console.log(testcasesDir);
        const testcases = fs.readdirSync(testcasesDir)
                            .filter(file => file.startsWith("input"))
                            .sort();
        
        console.log("Found testcases:", testcases);
        let allPassed = true;
        
        let maxTime = 0;

        for (const testcase of testcases) { 
            let input = "";
            let expectedOutput = "";
            try{
                input = fs.readFileSync(path.join(testcasesDir, testcase), "utf-8");
                expectedOutput = fs.readFileSync(path.join(testcasesDir, testcase.replace("input", "output")), "utf-8").trim();
            }
            catch (err) {
                console.error("Error reading test case files:", err);
                submission.status = "Failed";
                submission.verdict = "Runtime Error";
                await submission.save();
                return;
            }

            const timelimit = problem.timelimit/1000; // seconds

            console.log("Starting testcase:", testcase);

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
            
            if (stderr) {
                console.log("STDERR:", stderr);
            }
            
            const runResult = await exec.inspect();

            console.log("Run result :\n", runResult);

            if (runResult.ExitCode === 137) {
                submission.status = "Completed";
                submission.verdict = "Memory Limit Exceeded";

                await submission.save();
                return;
            }

            if (runResult.ExitCode === 124) {

                submission.status = "Completed";
                submission.verdict = "Time Limit Exceeded";

                await submission.save();
                return;
            }

            if (runResult.ExitCode !== 0) {

                submission.status = "Completed";
                submission.verdict = "Runtime Error";

                await submission.save();
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
        console.log("Loop completed");

        submission.status = "Completed";
        submission.verdict = allPassed ? "Accepted" : "Wrong Answer";
        submission.executionTime = maxTime;

        await submission.save();
        
    }
    catch (error) {

        console.error(
            "Judge Error:",
            error
        );

        submission.status =
            "Failed";

        submission.verdict =
            "Runtime Error";

        await submission.save();

    }
    finally {

        try {

            if (container) {
                await container.remove({
                    force: true
                });
            }

        }
        catch {}

    }

};