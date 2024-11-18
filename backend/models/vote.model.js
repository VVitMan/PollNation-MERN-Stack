import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
    userId: 
    { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // The user who voted
    pollId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Poll', 
        required: true 
    }, // The poll being voted on
    optionIndex: { type: Number, required: true }, // The index of the option chosen
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Vote', VoteSchema);