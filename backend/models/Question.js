import mongoose from "mongoose";

// Update choiceSchema to include an image for each choice
const choiceSchema = new mongoose.Schema({
    choiceText: { type: String, required: true },
    isCorrect: { type: Boolean }, // Only relevant for quizzes
    explanation: { type: String, default: "" }, // Optional, for correct answers in quizzes
    choiceImage: { type: String, default: "" } // Optional image for the choice
});
  
const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentText: { type: String, required: true },
    commentedAt: { type: Date, default: Date.now }
});
  
const questionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['poll', 'quiz'], required: true },
    picture: { type: String, default: "" },
    choices: [choiceSchema],
    comments: [commentSchema],
    likes: { type: Map, of: Boolean, default: {} } // Map for likes
  }, { timestamps: true });
  
  
const Question = mongoose.model('Question', questionSchema);
  
export default Question;
  