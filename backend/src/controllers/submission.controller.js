import Submission from "../models/submission.model.js";
import Contest from "../models/contest.model.js";
import ContestParticipant from "../models/contestParticipant.model.js";
import Problem from "../models/problem.model.js";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { addJobToJudgeQueue } from "../queue/judge.queue.js";

const submitSolution = asyncHandler(async (req, res) => {
    const { problemId, language, code, contestId } = req.body;

    // Validate all required fields
    if (problemId === undefined ||
        language === undefined ||
        code === undefined) {
        throw new ApiError(400, 'Missing required fields: problemId, language, and code are required.');
    }

    if (!code.trim()) {
        throw new ApiError(400, 'Code cannot be empty.');
    }


    // Validate the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new ApiError(404, 'Problem not found.');
    }
    let participant = null;
    if (contestId) {
        // Validate the contest
        const contest = await Contest.findById(contestId);
        if (!contest) {
            throw new ApiError(404, 'Contest not found.');
        }

        // Check if the user is a participant of the contest
        participant = await ContestParticipant.findOne({
            user: req.user._id,
            contest: contestId
        });

        if (!participant) {
            throw new ApiError(403, 'You are not a participant of this contest.');
        }
    }

    // Create a new submission
    const submission = new Submission({
        user: req.user._id,
        problem: problemId,
        contest: contestId || null,
        language,
        code
    });

    await submission.save();

    // Queue the job to the judge queue
    try {
        await addJobToJudgeQueue({
            submissionId: submission._id,
            contestId: contestId || null,
            contestParticipantId: participant ? participant._id : null
        })
    }
    catch (error) {
        console.error("Error adding job to queue", error);
        throw new ApiError(500, 'Unable to queue submission. Please try again.');
    }

    res.status(201).json(new ApiResponse(201, 'Submission created successfully.', { submissionId: submission._id }));

});

const getSubmission = asyncHandler(async (req, res) => {
    const submissionId = req.params.submissionId;

    const submission = await Submission.findById(submissionId)

    if (!submission) {
        throw new ApiError(404, 'Submission not found.');
    }

    // Ensure the user can only view their own submissions or if they are an admin
    if (!submission.user.equals(req.user._id) && req.user.role !== 'admin') {
        throw new ApiError(403, 'You do not have permission to view this submission.');
    }

    res.status(200).json(new ApiResponse(200, 'Submission retrieved successfully.', { submission }));
});

const getMySubmissions = asyncHandler(async (req, res) => {
    const submissions = await Submission.find({
        user: req.user._id
    })
        .sort({ createdAt: -1 })
        .populate('problem', 'title slug')
        .populate('contest', "title");

    return res.status(200).json(
        new ApiResponse(
            200,
            'Submissions retrieved successfully.',
            { submissions }
        )
    );
});

export {
    submitSolution,
    getSubmission,
    getMySubmissions
};