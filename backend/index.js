import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import pollRoutes from './routes/poll.route.js';
import quizRoutes from './routes/quiz.route.js';
import pollAndQuizRoutes from './routes/poll_and_quiz.route.js';
import commentRoutes from './routes/comment.route.js'; // Import the comment routes
import voteRoutes from './routes/vote.route.js'; // Import the vote routes
import cookieParser from 'cookie-parser';

dotenv.config();

/* Initial "app" from express */
const app = express();

/* Allow JSON parsing from body request */
app.use(express.json());

/* Cookie Parser */
app.use(cookieParser());

/* Server Port */
const port = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/* Connect MongoDB */
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });

/* Routes */
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/poll", pollRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/poll-and-quiz", pollAndQuizRoutes);
app.use("/api/comments", commentRoutes); // Register the comment routes
app.use("/api/vote", voteRoutes); // Register the vote routes

/* Error Middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Error Middleware:", message); // Log error for debugging
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});
