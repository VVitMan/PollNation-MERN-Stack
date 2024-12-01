import express from 'express';
import { verifyToken } from '../utils/verifyUser.js'; // Middleware for authentication
import {
    addComment,
    getCommentsByPost,
    deleteComment,
    editComment, // Route to edit a specific comment by ID (not shown here)
} from '../controllers/comment.controller.js'; // Import controller functions

const router = express.Router();

// Route to add a new comment
router.post('/create', verifyToken, addComment);

// Route to get all comments for a specific post (poll/quiz)
router.get('/find/posts/:postId', getCommentsByPost);

// Route to delete a specific comment by ID
router.delete('/delete/:commentId', verifyToken, deleteComment);

/* Route to edit a specific comment by ID */
router.put('/edit/:commentId', verifyToken, editComment);

export default router;
