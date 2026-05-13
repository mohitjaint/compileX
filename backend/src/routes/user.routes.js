import { Router } from "express";
import { 
    registerUser,
    loginUser,
    getCurrentUser,
    rotateTokens,
    logoutUser
 } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/rotate-tokens', rotateTokens);

//secured routes 
router.get('/me',verifyJWT, getCurrentUser);
router.post('/logout', verifyJWT, logoutUser);

export default router;