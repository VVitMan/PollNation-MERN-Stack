import express from 'express';
import { createQuiz, getAllQuizzes, getQuizById, updateQuiz, deleteQuiz, submitQuizAnswer } from '../controllers/quiz.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Route to create a new quiz
router.post('/create', verifyToken, createQuiz);

// Route to get all quizzes
router.get('/all', getAllQuizzes);

// Route to get a specific quiz by ID
router.get('/:quizId', getQuizById);

// Route to update a quiz
router.put('/update/:quizId', verifyToken, updateQuiz);

// Route to delete a quiz
router.delete('/delete/:quizId', verifyToken, deleteQuiz);

// Route to submit an answer to a quiz
router.post('/answer/:quizId', verifyToken, submitQuizAnswer);

export default router;