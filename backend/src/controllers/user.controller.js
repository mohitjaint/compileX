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

const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    // Validate input
    if (!email && !username) {
        throw new ApiError(400, 'Email or username is required');
    }
    if (!password) {
        throw new ApiError(400, "Password is required");
    }
    // Check if user exists
    const user = await User.findOne({
        $or: [
            {email},
            {username}
        ]
    });
    if (!user) {
        throw new ApiError(400, 'Invalid email/username or password');
    }
    //Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(400, 'Invalid email/username or password');
    }
    // generate access token
    const accessToken = user.generateAccessToken();
    // generate refresh token
    const refreshToken = user.generateRefreshToken();
    // Save refresh token to database
    user.refreshToken = refreshToken;
    // cookies optons
    const options = {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    };
    //Save user with refresh token
    await user.save({validateBeforeSave: false});

    // Send response with tokens and user data
    const userData = await User.findById(user._id).select('-passwordHash -refreshToken');
    res.status(200)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, 'Login successful', {
        accessToken,
        user: userData
    }));
});

export {
    registerUser,
    loginUser
};