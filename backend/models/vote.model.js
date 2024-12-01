import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, // The user who voted
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll/Quiz ID',
    },
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
        required: true,
    }, // The option chosen (referencing the Option model)
    isCorrect: { type: Boolean }, // For quizzes, whether the selected answer was correct
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Vote', VoteSchema);