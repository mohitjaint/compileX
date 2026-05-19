import { Router } from "express";
import {
    createContest,
} from "../controllers/contest.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/adminCheck.middleware.js";

const router = Router();

//secure routes 
router.post('/create', verifyJWT, adminCheck, createContest);

export default router;