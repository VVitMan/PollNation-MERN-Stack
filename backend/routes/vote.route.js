import express from 'express';
import { updateVote, getMyAnswers } from '../controllers/vote.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Import the verifyToken middleware

const router = express.Router();


// Unified vote update route
router.post("/voting", verifyToken, updateVote);

// Get votes for a specific poll or quiz
router.get('/myanswers', verifyToken, getMyAnswers);

export default router;