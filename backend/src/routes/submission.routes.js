import { Router } from "express";
import { 
    submitSolution,
    getSubmission,
    getMySubmissions
} from "../controllers/submission.controller.js";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/adminCheck.middleware.js";

const router = Router();

router.get('/my-submissions', verifyJWT, getMySubmissions);
router.get('/:submissionId', verifyJWT, getSubmission); 

router.post('/submit', verifyJWT, submitSolution);

export default router;