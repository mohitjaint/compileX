import { Router } from "express";
import {
    createContest,
    getContests,
    getContestById,
    updateContest
} from "../controllers/contest.controller.js";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js";
import { adminCheck } from "../middlewares/adminCheck.middleware.js";

const router = Router();
//public routes
router.get('/', optionalVerifyJWT, getContests);
router.get('/:id', optionalVerifyJWT, getContestById);
//secure routes 
router.post('/create', verifyJWT, adminCheck, createContest);
router.patch('/:id', verifyJWT, adminCheck, updateContest);

export default router;