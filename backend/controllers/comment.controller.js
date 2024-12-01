import Comment from '../models/comment.model.js';
import Poll from '../models/poll.model.js';
import Quiz from '../models/quiz.model.js';

/**
 * Add a new comment
 */
export const addComment = async (req, res) => {
    const { postId, content } = req.body; // Extract postId from the body

    if (!postId || !content) {
        return res.status(400).json({ error: 'postId and content are required.' });
    }

    try {
        const userId = req.user.id; // Extract user ID from verified token

        // Check if the postId exists in either Poll or Quiz
        const isPoll = await Poll.findById(postId);
        const isQuiz = !isPoll ? await Quiz.findById(postId) : null;

        if (!isPoll && !isQuiz) {
            return res.status(404).json({ error: 'The referenced post does not exist.' });
        }

        // Create and save the comment
        const newComment = new Comment({ postId, userId, content });
        await newComment.save();

        // Populate user details for the response
        const populatedComment = await newComment.populate('userId', 'username profilePicture');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('[From Comment Controller] Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
};



/**
 * Get all comments for a specific post
 */
export const getCommentsByPost = async (req, res) => {
    const { postId } = req.params;

    try {
        // Ensure postId is valid
        if (!postId || !postId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid postId format.' });
        }

        // Check if the postId exists in Poll or Quiz
        const isPoll = await Poll.findById(postId);
        const isQuiz = !isPoll ? await Quiz.findById(postId) : null;

        if (!isPoll && !isQuiz) {
            return res.status(404).json({ error: 'The referenced post does not exist.' });
        }

        // Fetch and populate comments
        const comments = await Comment.find({ postId })
            .sort({ timestamp: -1 })
            .populate('userId', 'username profilePicture');

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Delete a specific comment by ID
 */
export const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        // Ensure commentId is valid
        if (!commentId || !commentId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid commentId format.' });
        }

        // Delete the comment
        const comment = await Comment.findByIdAndDelete(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment.' });
    }
};

/**
 * Edit a specific comment by ID
 */
export const editComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body; // Updated content of the comment

    try {
        // Validate inputs
        if (!commentId || !commentId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid commentId format.' });
        }

        if (!content || content.trim() === "") {
            return res.status(400).json({ error: 'Content cannot be empty.' });
        }

        // Find and update the comment
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true } // Return the updated document
        ).populate('userId', 'username profilePicture'); // Populate user details

        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error editing comment:', error);
        res.status(500).json({ error: 'Failed to edit comment.' });
    }
};
