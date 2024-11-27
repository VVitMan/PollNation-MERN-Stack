import Comment from '../models/comment.model.js';

// Add a new comment
export const addComment = async (req, res) => {
    const { postId, userId, content, parentCommentId } = req.body;

    if (!postId || !userId || !content) {
        return res.status(400).json({ message: 'postId, userId, and content are required.' });
    }

    try {
        const newComment = new Comment({ postId, userId, content, parentCommentId });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment.' });
    }
};

// Get all comments for a post
export const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ postId }).sort({ timestamp: -1 }); // Most recent comments first
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments.' });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Failed to delete comment.' });
    }
};
