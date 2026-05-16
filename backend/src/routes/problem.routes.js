import { Router } from "express";

import { createProblem, 
        getAllProblems,
        getProblemBySlug,
        updateProblem,
        updateProblemTestCases } from "../controllers/problem.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/adminCheck.middleware.js";
import { uploadTestCases } from "../middlewares/multer.middleware.js";

const router = Router();

//public routes
router.get('/all', getAllProblems);
router.get('/:slug', getProblemBySlug);

//secure routes 
router.post('/create', verifyJWT, adminCheck, uploadTestCases, createProblem);
router.patch('/:id', verifyJWT, adminCheck, uploadTestCases, updateProblem);
router.patch('/:id/testcases', verifyJWT, adminCheck, uploadTestCases, updateProblemTestCases);
export default router;