import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    options: [
        {
            text: { type: String, required: true },
            correct: { type: Boolean, default: false }, // Marks the correct answer(s)
            explanation: { type: String }, // Optional explanation for the correct answer
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Quiz', QuizSchema);