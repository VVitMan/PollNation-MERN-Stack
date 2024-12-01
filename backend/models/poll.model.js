import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    question: { type: String, required: true },
    options: [
        {
            text: { type: String, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Poll', PollSchema);