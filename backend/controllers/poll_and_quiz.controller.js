import User from "../models/user.model.js";
import Poll from "../models/poll.model.js";
import Quiz from '../models/quiz.model.js';
import Vote from '../models/vote.model.js';

/* Get Poll and Quizz from all user */
export const getAllPollsAndQuizzes = async (req, res) => {
    try {
        const polls = await Poll.find().populate('userId', 'username profilePicture');
        const quizzes = await Quiz.find().populate('userId', 'username profilePicture');

        const combinedData = [
            ...polls.map(poll => ({ ...poll._doc, type: 'Poll' })),
            ...quizzes.map(quiz => ({ ...quiz._doc, type: 'Quiz' })),
        ];

        res.status(200).json(combinedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/* Get Poll and Quizz from user @username */
export const getPollsAndQuizzesByUser = async (req, res) => {
    try {
        // Find the user by username
        const user = await User.findOne({ username: req.params.username });
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