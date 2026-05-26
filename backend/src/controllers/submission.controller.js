import Submission from "../models/submission.model.js";
import Contest from "../models/contest.model.js";
import ContestParticipant from "../models/contestParticipant.model.js";
import Problem from "../models/problem.model.js";
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';


const submitSolution = asyncHandler(async (req, res) => {
    const { problemId, language, code } = req.body;
    const contestId = req.params.contestId;

    // Validate all required fields
    if (problemId === undefined || 
        language === undefined || 
        code === undefined ||
        contestId === undefined) {
        throw new ApiError(400, 'Missing required fields: problemId, contestId, language, and code are required.');
    }

    if(!code.trim()) {
        throw new ApiError(400, 'Code cannot be empty.');
    }

    // Validate contest existence
    const contest = await Contest.findById(contestId).select('problems startTime endTime');
    if (!contest) {
        throw new ApiError(404, 'Contest not found.');
    }

    // Validate if contest is active    
    const now = new Date();
    if (now < contest.startTime || now > contest.endTime) {
        throw new ApiError(400, 'Contest is not active. Submissions are only allowed during the contest duration.');
    }

    // Validate if user is a participant of the contest
    const participant = await ContestParticipant.exists({ contest: contestId, user: req.user._id });
    if (!participant) {
        throw new ApiError(403, 'You are not a participant of this contest. Please join the contest to submit solutions.');
    }

    // Validate if contest includes the specified problem
    if (
        !contest.problems.some(
            p => p.equals(problemId)
        )
    ) {
        throw new ApiError(400, 'The specified problem is not part of the contest.');
    }

    // Create submission
    const submission = new Submission({
        user: req.user._id,
        problem: problemId,
        contest: contestId,
        language,
        code
    });

    await submission.save();

    res.status(201).json(new ApiResponse(201, 'Submission created successfully.', { submissionId: submission._id }));
    
});

const getSubmission = asyncHandler(async (req, res) => {
    const submissionId = req.params.submissionId;

    const submission = await Submission.findById(submissionId)  

    if (!submission) {
        throw new ApiError(404, 'Submission not found.');
    }

    // Ensure the user can only view their own submissions or if they are an admin
    if (!submission.user.equals(req.user._id) && !req.user.role === 'admin') {
        throw new ApiError(403, 'You do not have permission to view this submission.');
    }

    res.status(200).json(new ApiResponse(200, 'Submission retrieved successfully.', { submission }));
});

export {
    submitSolution,
    getSubmission
 };