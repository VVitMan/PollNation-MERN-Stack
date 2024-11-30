import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, // The user who voted
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
    }, // The poll being voted on (optional if it's a quiz)
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
    }, // The quiz being voted on (optional if it's a poll)
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
        required: true,
    }, // The option chosen (referencing the Option model)
    optionIndex: { type: Number, required: true }, // The index of the option chosen
    type: { type: String, enum: ['Poll', 'Quiz'], required: true }, // Vote type (Poll or Quiz)
    isCorrect: { type: Boolean }, // For quizzes, whether the selected answer was correct
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Vote', VoteSchema);
