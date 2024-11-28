import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user being reported
  reporterUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user reporting
  reason: { type: String, required: true }, // Reason for the report
  createdAt: { type: Date, default: Date.now }, // Timestamp of the report
});

export default mongoose.model('Report', reportSchema);
