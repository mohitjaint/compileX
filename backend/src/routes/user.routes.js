import { Router } from "express";
import { 
    registerUser,
    loginUser,
    getCurrentUser,
    rotateTokens,
    logoutUser,
    updateUserProfile,
    updateUserPassword,
    updateUserAvatar
 } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/rotate-tokens', rotateTokens);

//secured routes 
router.get('/me',verifyJWT, getCurrentUser);
router.post('/logout', verifyJWT, logoutUser);
router.patch('/update-profile', verifyJWT, updateUserProfile);
router.patch('/update-password', verifyJWT, updateUserPassword);
router.patch('/update-avatar', verifyJWT, uploadAvatar, updateUserAvatar);

export default router;