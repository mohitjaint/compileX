import Problem from '../models/problem.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import path from 'path';
import fs from 'fs';
import {ensureDirectoryExists, deleteDirectoryIfExists, extractZip, parseJSONSafe} from '../utils/fileSystem.js';

const createProblem = asyncHandler(async (req, res) => {
    try {
        const {title, slug, statement, inputFormat, outputFormat, constraints, sampleTestCases, timelimit, memorylimit, difficulty} = req.body;

        // check if all the fields are present
        if ([title, slug, statement, inputFormat, outputFormat, constraints, sampleTestCases, timelimit, memorylimit, difficulty].some(field => field === undefined)) {
            
            throw new ApiError(400, 'All fields are required');
        }

        // check if problem with the same slug already exists
        const existingProblem = await Problem.findOne({slug});
        if (existingProblem) {
            throw new ApiError(400, 'Problem with the same slug already exists');
        }
    
        //check if hidden test cases file is present
        if (!req.file) {
            throw new ApiError(400, 'Hidden test cases file is required');
        }
        // create new problem
        const parsedSampleTestCases = parseJSONSafe(sampleTestCases);

        const newProblem = new Problem({
            title,
            slug,
            statement,
            inputFormat,
            outputFormat,
            constraints,
            sampleTestCases : parsedSampleTestCases,
            hiddenTestCasesPath : 'temp', // will be updated later after processing the uploaded file
            timelimit,
            memorylimit,
            difficulty,
            createdBy: req.user._id
        });

        await newProblem.save();
        let destinationPath ;
        try{
            // process the uploaded hidden test cases file
            destinationPath = path.join("storage", "testcases", newProblem._id.toString());
            extractZip(req.file.path, destinationPath);
        }
        catch (error) {
            // delete the problem if there was an error processing the test cases file
            deleteDirectoryIfExists(destinationPath);

            await Problem.findByIdAndDelete(newProblem._id);
            
            throw new ApiError(500, 'An error occurred while processing the hidden test cases file');
        }
        // update the problem with the path to the hidden test cases
        newProblem.hiddenTestCasesPath = destinationPath;
        await newProblem.save();

        res.status(201).json(new ApiResponse(201, 'Problem created successfully', newProblem));
    }
    catch (error) {
        throw new ApiError(500, 'An error occurred while creating the problem');
    }
    finally {
        // delete the uploaded zip file if it still exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
    
});

export {
    createProblem
};

    
