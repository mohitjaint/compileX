import { Router } from "express";

import { createProblem, getAllProblems } from "../controllers/problem.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/adminCheck.middleware.js";
import { uploadTestCases } from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/create', verifyJWT, adminCheck, uploadTestCases, createProblem);
router.get('/all', getAllProblems);

export default router;