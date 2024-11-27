import express from 'express';
import { verifyToken } from '../utils/verifyUser.js'; // Import the middleware
import Comment from '../models/comment.model.js';
import Poll from '../models/poll.model.js';
import Quiz from '../models/quiz.model.js';

const router = express.Router();

// Add a new comment
router.post('/', verifyToken, async (req, res) => {
    const { postId, content, parentCommentId } = req.body;

    if (!postId || !content) {
        return res.status(400).json({ error: 'postId and content are required.' });
    }

    try {
        const userId = req.user.id; // Extract user ID from the verified token

        // Check if the postId exists in either Poll or Quiz
        const isPoll = await Poll.findById(postId);
        const isQuiz = !isPoll ? await Quiz.findById(postId) : null;

        if (!isPoll && !isQuiz) {
            return res.status(404).json({ error: 'The referenced post does not exist.' });
        }

        const newComment = new Comment({ postId, userId, content, parentCommentId });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
});

// Get all comments for a specific post
router.get('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    // Fetch all comments for the post
    const comments = await Comment.find({ postId }).sort({ timestamp: -1 });

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this post.' });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a specific comment by ID
router.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment.' });
  }
});

export default router;
