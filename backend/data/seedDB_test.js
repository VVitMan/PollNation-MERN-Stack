// seedDatabase.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { users, questions } from './mockup.js'; // Ensure path is correct
import User from '../models/User.js'; // Ensure path to User model is correct
import Question from '../models/Question.js'; // Ensure path to Question model is correct

// Load environment variables
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Question.deleteMany({});

        // Insert users
        const insertedUsers = await User.insertMany(users);
        console.log('Inserted Users:', insertedUsers);

        // Insert questions
        const insertedQuestions = await Question.insertMany(questions);
        console.log('Inserted Questions:', insertedQuestions);

        console.log('Database seeding completed!');
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        // Disconnect from MongoDB
        mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
};

// Run the seed function
seedDatabase();
