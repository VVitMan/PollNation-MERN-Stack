import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getAllPollsAndQuizzes, createPollAndQuiz, getPollsAndQuizzesByUser, getPollsAndQuizzesById, updatePollAndQuiz } from '../controllers/poll_and_quiz.controller.js';

const router = express.Router();

router.get('/all', getAllPollsAndQuizzes);
router.get('/:username', getPollsAndQuizzesByUser);
router.post('/create', verifyToken, createPollAndQuiz);

/* Get Poll and Quiz by ID of poll or quiz */
router.get('/find/:id', getPollsAndQuizzesById);

/* Update Poll or Quizz by ID */
router.put('/update/:id', verifyToken, updatePollAndQuiz);


export default router;