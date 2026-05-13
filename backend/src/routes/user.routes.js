import { Router } from "express";
import { 
    registerUser,
    loginUser,
    getCurrentUser,
    rotateTokens
 } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

//secured routes 
router.get('/me',verifyJWT, getCurrentUser);
router.post('/rotate-tokens', rotateTokens);

export default router;