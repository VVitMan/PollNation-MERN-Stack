import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getFeedQuestions, getUserQuestions, likeQuestion} from "../controllers/questions.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedQuestions); // fetch all question to homepage
router.get("/:userId/questions", verifyToken, getUserQuestions); //fetch question on their provide

/* UPDATE */
router.patch("/:id/like", verifyToken, likeQuestion); // update like on question

export default router;















/* provide by chatGPT
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createQuestion, getQuestionById, getAllQuestions,
    updateQuestion, deleteQuestion, likeQuestion} from '../controllers/questions.js';

const router = express.Router();

// CREATE a new question (only accessible to logged-in users)
router.post('/', verifyToken, createQuestion); // POST /questions/

// READ a questions by ID (accessible to everyone)
router.get('/:id', verifyToken, getQuestionById); // GET /questions/:id

// READ all questions (accessible to everyone)
router.get('/', verifyToken, getAllQuestions); // GET /questions/

// UPDATE a questions by ID (only accessible to logged-in users)
router.put('/:id', verifyToken, updateQuestion); // PUT /questions/:id

// DELETE a questions bsy ID (only accessible to logged-in users)
router.delete('/:id', verifyToken, deleteQuestion); // DELETE /questions/:id

// LIKE or UNLIKE a questions (only accessible to logged-in users)
router.patch('/:id/like', verifyToken, likeQuestion); // PATCH /questions/:id/like

export default router; */
