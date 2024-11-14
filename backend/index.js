import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from 'cookie-parser';
dotenv.config();

/* Initial "app" from express */
const app = express();

/* allow json parsing from body request */
app.use(express.json());

/* Cookie Parser */
app.use(cookieParser());

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})

/* Connect MongoDB */
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connect to MongoDB");
    })
    // use "err" for dev phase
    .catch((err) => {
        console.log(err);
    })

/* Routes */
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

/* Error Middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Interval Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
})