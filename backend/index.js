import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

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