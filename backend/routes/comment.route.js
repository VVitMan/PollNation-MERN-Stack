import express from 'express';
import { verifyToken } from '../utils/verifyUser.js'; // Middleware for authentication
import {
    addComment,
    getCommentsByPost,
    deleteComment,
} from '../controllers/comment.controller.js'; // Import controller functions

const router = express.Router();

// Route to add a new comment
router.post('/', verifyToken, addComment);

// Route to get all comments for a specific post (poll/quiz)
router.get('/posts/:postId/comments', getCommentsByPost);

// Route to delete a specific comment by ID
router.delete('/:commentId', verifyToken, deleteComment);

export default router;
