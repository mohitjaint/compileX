import User from '../models/user.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
const registerUser  = asyncHandler(async (req, res) => {
    const {username, fullName, email, password} = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [
            {email},
            {username}
        ]
    }) 
    if (existingUser) {
        throw new ApiError(400, 'User already exists with this email or username');
    }
    // Check if all fields are provided
    if ( [username, fullName, email, password].some(field=> !field?.trim())){
        throw new ApiError(400, 'All fields are required');
    }
    // Create new user
    const newUser = new User({
        username,
        fullName,
        email,
        passwordHash : password
    });
    //Save user to database
    await newUser.save();

    res.status(201).json(new ApiResponse(201, 'User registered successfully', {
        userId: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
    }));
});

export {registerUser};