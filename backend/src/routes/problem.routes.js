import { Router } from "express";

import { createProblem } from "../controllers/problem.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/adminCheck.middleware.js";
import { uploadTestCases } from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/create', verifyJWT, adminCheck, uploadTestCases, createProblem);

export default router;