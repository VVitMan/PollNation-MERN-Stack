import express from 'express';
import { createVote, updateVote, deleteVote, getVotes } from '../controllers/vote.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Import the verifyToken middleware

const router = express.Router();

// Create a new vote
router.post('/', verifyToken, createVote);

// Update an existing vote
router.put('/', verifyToken, updateVote);

// Delete a vote
router.delete('/', verifyToken, deleteVote);

// Get votes for a specific poll or quiz
router.get('/', verifyToken, getVotes);

export default router;
