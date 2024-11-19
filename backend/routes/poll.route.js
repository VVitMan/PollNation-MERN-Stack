import express from 'express';
import { testPoll, createPoll, getAllPolls, getUserPolls, getAnotherUserPolls, submitPollVote, editPoll, deletePoll } from '../controllers/poll.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/", testPoll);
router.get("/all", getAllPolls); // Fetch all polls
router.get("/user", verifyToken, getUserPolls); // Fetch polls created by the authenticated user ของตัวเอง
router.get("/profile/:username", getAnotherUserPolls); // Fetch polls of another user
router.post("/create", verifyToken, createPoll); // Create a new poll
router.put("/vote/:poll_id", verifyToken, submitPollVote); // Submit a vote to a poll
router.put("/edit/:poll_id", verifyToken, editPoll); // Edit a poll
router.delete("/delete/:poll_id", verifyToken, deletePoll); // Delete a poll


export default router;