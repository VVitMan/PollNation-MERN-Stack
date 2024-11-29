import express from 'express';
import { createVote, updateVote, deleteVote, getVotes, getUserVoteForPoll } from '../controllers/vote.controller.js';
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

router.get('/vote/poll', getUserVoteForPoll);

router.get('/vote/poll-options', async (req, res) => {
    try {
      const { userId } = req.query;
  
      if (!userId) {
        return res.status(400).json({ message: 'Missing userId' });
      }
  
      // Fetch votes for the user
      const votes = await Vote.find({ userId });
  
      if (!votes || votes.length === 0) {
        return res.status(404).json({ message: 'No votes found' });
      }
  
      res.status(200).json({ votes });
    } catch (error) {
      console.error('Error fetching votes:', error.message);
      res.status(500).json({ message: 'Error fetching votes', error: error.message });
    }
  });
  

export default router;
