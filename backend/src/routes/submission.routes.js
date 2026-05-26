import { Router } from "express";
import { 
    submitSolution,
    getSubmission
} from "../controllers/submission.controller.js";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/adminCheck.middleware.js";

const router = Router();

router.get('/:submissionId', verifyJWT, getSubmission); 

export default router;