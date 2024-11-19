import Quiz from '../models/quiz.model.js';
import Vote from '../models/vote.model.js';
import { errorCustom } from '../utils/errorCustom.js';

export const createQuiz = async (req, res) => {
    try {
        const { question, options } = req.body;

        // Validate that at least one correct option exists
        if (!options.some(option => option.correct)) {
            return res.status(400).json({ message: 'At least one option must be marked as correct.' });
        }

        const quiz = new Quiz({
            userId: req.user.id, // Get user ID from the verified token
            question,
            options,
        });

        await quiz.save();
        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* All Quizzes */
export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('userId', 'username profilePicture'); // Fetch user details
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* Quiz of user own ของตัวเอง*/
export const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate('userId', 'username profilePicture');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* Quiz ของคนอื่น */

/* Update Quiz */
export const updateQuiz = async (req, res) => {
    try {
        const { question, options } = req.body;

        // Find the quiz and validate ownership
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        if (quiz.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to edit this quiz.' });
        }

        // Update the fields
        if (question) quiz.question = question;
        if (options) quiz.options = options;

        await quiz.save();
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* Delete Quiz */
export const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        // Validate ownership
        if (quiz.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this quiz.' });
        }

        await Quiz.findByIdAndDelete(req.params.quizId);
        res.status(200).json({ message: 'Quiz deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* Submit Answer */
export const submitQuizAnswer = async (req, res) => {
    try {
      const { optionIndex } = req.body;
      const userId = req.user.id; // Extract user ID from the token (via verifyToken middleware)
  
      // Find the quiz
      const quiz = await Quiz.findById(req.params.quizId);
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  
      // Check if the user has already submitted an answer for this quiz
      const existingVote = await Vote.findOne({ userId, quizId: req.params.quizId });
      if (existingVote) {
        return res.status(403).json({ message: 'You have already submitted an answer for this quiz.' });
      }
  
      // Validate the option index
      if (optionIndex < 0 || optionIndex >= quiz.options.length) {
        return res.status(400).json({ message: 'Invalid option index' });
      }
  
      // Check if the selected option is correct
      const isCorrect = quiz.options[optionIndex].correct;
  
      // Record the vote in the Vote model
      const vote = new Vote({
        userId,
        quizId: req.params.quizId,
        optionIndex,
        type: 'Quiz', // Add vote type
        isCorrect, // Save correctness for quizzes
      });
      await vote.save();
  
      res.status(200).json({
        message: isCorrect ? 'Correct answer!' : 'Incorrect answer.',
        explanation: quiz.options[optionIndex]?.explanation || null,
        vote,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
