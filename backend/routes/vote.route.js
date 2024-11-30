import express from 'express';
import { createVote, updateVote, deleteVote, getMyAnswers } from '../controllers/vote.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Import the verifyToken middleware

const router = express.Router();

// Create a new vote
router.post('/create', verifyToken, createVote);

// Update an existing vote
router.put('/change', verifyToken, updateVote);

// Delete a vote
router.delete('/delete', verifyToken, deleteVote);

// Get votes for a specific poll or quiz
router.get('/myanswers', verifyToken, getMyAnswers);

export default router;