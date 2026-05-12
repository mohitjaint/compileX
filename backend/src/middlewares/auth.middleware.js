import jwt from "jsonwebtoken";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import User from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    // Check if token exists
    if (!token) {
        throw new ApiError(401,"Unauthorized");
    }
    let decoded = null;
    try {
        // Verify access token
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }
    catch (err) {
        throw new ApiError(401, 'Invalid or expired token');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new ApiError(401, 'Unauthorized: User not found');
    }
    req.user = user; // Attach user to request object
    next();
});

export {verifyJWT};