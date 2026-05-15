import Problem from '../models/problem.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

const createProblem = asyncHandler(async (req, res) => {
    try {
        // check if user is admin or not
        if (req.user.role !== 'admin') {
            
            throw new ApiError(403, 'Only admins can create problems');
        }

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
        const parsedSampleTestCases = JSON.parse(sampleTestCases);
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
            // unzip the hidden test cases and store them in a folder named after the       problem id
            const zip = new AdmZip(req.file.path);
            destinationPath = path.join('storage', 'testcases', newProblem._id.toString());

            // Ensure the destination directory exists
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }
            zip.extractAllTo(destinationPath, true);
        }
        catch (error) {
            // delete the problem if there was an error processing the test cases file
            if (destinationPath && fs.existsSync(destinationPath)) {
                fs.rmSync(destinationPath, {
                    recursive: true,
                    force: true
                });
            }

            await Problem.findByIdAndDelete(newProblem._id);
            
            throw new ApiError(500, 'An error occurred while processing the hidden test cases file');
        }
        // update the problem with the path to the hidden test cases
        newProblem.hiddenTestCasesPath = destinationPath;
        await newProblem.save();

        res.status(201).json(new ApiResponse(201, 'Problem created successfully', newProblem));
    }
    catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }

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

    
