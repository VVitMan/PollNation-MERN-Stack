import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model
        required: true,
    },
    reporterUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true, // Removes leading/trailing spaces
        maxlength: 500, // Optional: Limit the length of the reason
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current timestamp
    },
});

export default mongoose.model("Report", reportSchema);
