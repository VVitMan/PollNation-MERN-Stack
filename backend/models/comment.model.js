import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }
});

export default mongoose.model('Comment', commentSchema);
