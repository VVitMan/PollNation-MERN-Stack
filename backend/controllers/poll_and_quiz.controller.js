import User from "../models/user.model.js";
import Poll from "../models/poll.model.js";
import Quiz from '../models/quiz.model.js';
import Vote from '../models/vote.model.js';
import Comment from '../models/comment.model.js';

/* Get Poll and Quiz with Comment from all users */
export const getAllPollsAndQuizzes = async (req, res) => {
    try {
        console.log("Fetching all polls and quizzes...");
        const polls = await Poll.find().populate('userId', 'username profilePicture');
        const quizzes = await Quiz.find().populate('userId', 'username profilePicture');

        const combinedData = [
            ...polls.map(poll => ({ ...poll._doc, type: 'Poll' })),
            ...quizzes.map(quiz => ({ ...quiz._doc, type: 'Quiz' })),
        ];
        console.log("Data fetched:", combinedData);

        // Fetch comments for each post (poll or quiz)
        for (const item of combinedData) {
            item.comments = await Comment.find({ postId: item._id }).sort({ timestamp: -1 });
        }
        console.log("Comment fetched:", item.comments);

        res.status(200).json(combinedData);
    } catch (error) {
        console.error('Error fetching polls, quizzes, or comments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


/* Get Poll and Quizz from user @username */
export const getPollsAndQuizzesByUser = async (req, res) => {
    try {
        // Find the user by username and remove password
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch polls and quizzes created by the user
        const polls = await Poll.find({ userId: user._id });
        const quizzes = await Quiz.find({ userId: user._id });

        // Combine and structure the response
        const combinedData = [
            ...polls.map(poll => ({ ...poll._doc, type: 'Poll' })),
            ...quizzes.map(quiz => ({ ...quiz._doc, type: 'Quiz' })),
        ];

        res.status(200).json({ user, data: combinedData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPollAndQuiz = async (req, res) => {
    const { question, type, options } = req.body;

    try {
        // Ensure `userId` is included from the authenticated user
        const userId = req.user?.id; // Assuming `req.user` is populated by middleware
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: userId is missing' });
        }

        if (type === 'Poll') {
            const poll = new Poll({ question, options, userId }); // Include `userId` here
            await poll.save();
            res.status(201).json(poll);
        } else if (type === 'Quiz') {
            const quiz = new Quiz({ question, options, userId }); // Include `userId` here
            await quiz.save();
            res.status(201).json(quiz);
        } else {
            res.status(400).json({ message: 'Invalid type specified.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller Function for Getting Poll or Quiz by ID
export const getPollsAndQuizzesById = async (req, res) => {
    try {
        const { postId } = req.params;

        // Find by ID in both Poll and Quiz collections
        let data = await Poll.findById(postId);
        if (!data) {
            data = await Quiz.findById(postId);
        }

        if (!data) {
            return res.status(404).json({ message: 'Poll or Quiz not found' });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
};


// Controller Function for Updating Poll or Quiz by ID
export const updatePollAndQuiz = async (req, res) => {
    try {
        const { postId } = req.params;
        const { question, options } = req.body;

        if (!question || !options) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        // Update Poll or Quiz by finding the correct document
        let updatedData = await Poll.findByIdAndUpdate(
            postId,
            { question, options },
            { new: true }
        );

        if (!updatedData) {
            updatedData = await Quiz.findByIdAndUpdate(
                postId,
                { question, options },
                { new: true }
            );
        }

        if (!updatedData) {
            return res.status(404).json({ message: "Poll/Quiz not found" });
        }

        res.status(200).json({ message: `Poll/Quiz updated successfully`, data: updatedData });
    } catch (error) {
        console.error("Error updating poll/quiz:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};