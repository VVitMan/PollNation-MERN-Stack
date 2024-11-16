import express from 'express';
import { testPoll, createPoll, getAllPolls, getUserPolls, submitPollVote } from '../controllers/poll.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/", testPoll);
router.get("/all", getAllPolls); // Fetch all polls
router.get("/user", verifyToken, getUserPolls); // Fetch polls created by the authenticated user
router.post("/create", verifyToken, createPoll); // Create a new poll
router.put("/vote/:poll_id", verifyToken, submitPollVote); // Submit a vote to a poll


export default router;