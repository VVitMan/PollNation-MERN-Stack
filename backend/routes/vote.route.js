import express from 'express';
import { createOrToggleVote, updateVote, deleteVote, getUserVotes } from '../controllers/vote.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Import the verifyToken middleware

const router = express.Router();

// Create a new vote
router.post('/', verifyToken, createOrToggleVote);

// Update an existing vote
router.put('/', verifyToken, updateVote);

// Delete a vote
router.delete('/', verifyToken, deleteVote);

// Get votes for a specific poll or quiz
router.get("/user", verifyToken, getUserVotes);


export default router;
