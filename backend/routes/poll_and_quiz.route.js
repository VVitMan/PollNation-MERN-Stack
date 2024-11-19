import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getAllPollsAndQuizzes, createPollAndQuiz, getPollsAndQuizzesByUser } from '../controllers/poll_and_quiz.controller.js';

const router = express.Router();

router.get('/all', getAllPollsAndQuizzes);
router.get('/:username', getPollsAndQuizzesByUser);
router.post('/create', verifyToken, createPollAndQuiz);


export default router;