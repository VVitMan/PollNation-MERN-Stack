import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import pollRoutes from './routes/poll.route.js';
import quizRoutes from './routes/quiz.route.js';
import pollAndQuizRoutes from './routes/poll_and_quiz.route.js';
import commentRoutes from './routes/comment.route.js'; // Import the comment routes
import cookieParser from 'cookie-parser';

dotenv.config();

/* Initialize Express App */
const app = express();

/* Middleware Setup */
// Allow JSON parsing from body request
app.use(express.json());
// Cookie Parser
app.use(cookieParser());

/* Server Port */
const port = process.env.PORT || 3000;

/* MongoDB Connection */
mongoose
    .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err); // Use "err" for detailed error in dev phase
    });

/* Route Registration */
app.use("/api/user", userRoutes); // User routes including admin-specific actions
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/poll", pollRoutes); // Poll routes
app.use("/api/quiz", quizRoutes); // Quiz routes
app.use("/api/poll-and-quiz", pollAndQuizRoutes); // Combined poll and quiz routes
app.use("/api/comments", commentRoutes); // Comment routes

/* Error Handling Middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(`Error [${statusCode}]: ${message}`); // Log error details
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

/* Start Server */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
