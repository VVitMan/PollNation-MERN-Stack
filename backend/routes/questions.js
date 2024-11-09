import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createQuestion, getQuestionById, getAllQuestions,
    updateQuestion, deleteQuestion, likeQuestion} from '../controllers/questions.js';

const router = express.Router();

// CREATE a new question (only accessible to logged-in users)
router.post('/', verifyToken, createQuestion); // POST /question/

// READ a question by ID (accessible to everyone)
router.get('/:id', verifyToken, getQuestionById); // GET /question/:id

// READ all questions (accessible to everyone)
router.get('/', verifyToken, getAllQuestions); // GET /question/

// UPDATE a question by ID (only accessible to logged-in users)
router.put('/:id', verifyToken, updateQuestion); // PUT /question/:id

// DELETE a question by ID (only accessible to logged-in users)
router.delete('/:id', verifyToken, deleteQuestion); // DELETE /question/:id

// LIKE or UNLIKE a question (only accessible to logged-in users)
router.patch('/:id/like', verifyToken, likeQuestion); // PATCH /question/:id/like

export default router;
