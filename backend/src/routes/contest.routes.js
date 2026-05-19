import { Router } from "express";
import {
    createContest,
    getContests
} from "../controllers/contest.controller.js";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/adminCheck.middleware.js";

const router = Router();
//public routes
router.get('/', optionalVerifyJWT, getContests);
//secure routes 
router.post('/create', verifyJWT, adminCheck, createContest);

export default router;