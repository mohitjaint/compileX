import Contest from '../models/contest.model.js';
import Problem from '../models/problem.model.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';

const createContest = asyncHandler(async (req, res) => {
    const { title, description, problems, startTime, endTime, isPublic } = req.body;

    // Validate required fields
    if([title, description, problems, startTime, endTime].some(field => field === undefined)) {
        throw new ApiError(400, 'All fields are required');
    }

    // Verify if all problems exist and are active
    const validProblems = await Problem.find({ _id: { $in: problems }, isActive: true });
    if (validProblems.length !== problems.length) {
        throw new ApiError(400, 'One or more problems are invalid or inactive');
    }
    const createdBy = req.user._id;

    const contest = new Contest({
        title,
        description,
        problems,
        startTime,
        endTime,
        createdBy,
        isPublic
    });

    await contest.save();
    res.status(201).json(new ApiResponse(201, 'Contest created successfully', contest));
});

const getContests = asyncHandler(async (req, res) => {

    // If the user is an admin, return all contests. Otherwise, return only public contests 
    let filter = {isPublic: true};
    if (req?.user?.role === 'admin') {
        filter = {}; 
    } 
    const contests = await Contest
        .find(filter)
        .sort({ createdAt: -1 })
        .select('title startTime endTime isPublic'); 

    res.status(200).json(new ApiResponse(200, 'Contests retrieved successfully', contests));
});

const getContestById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contest = await Contest.findById(id).populate('problems', 'title difficulty slug');
    if (!contest || (!contest.isPublic && req?.user?.role !== 'admin')) {
        throw new ApiError(404, 'Contest not found');
    }

    // If the contest is not started yet, only admins can view it
    if (new Date() < contest.startTime && req?.user?.role !== 'admin') {
        throw new ApiError(403, 'Contest has not started yet');
    }

    res.status(200).json(new ApiResponse(200, 'Contest retrieved successfully', contest));
});

export { 
    createContest,
    getContests,
    getContestById
};