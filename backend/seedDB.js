import mongoose from 'mongoose';
import Question from './models/Question.js';
import User from './models/User.js';

import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

const seedData = async () => {
  try {
    // Create mock users
    const user1 = new User({
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashedpassword1', // Assuming password is already hashed
      picturePath: '/public/assets/profile_johndoe.jpg'
    });

    const user2 = new User({
      username: 'janedoe',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'hashedpassword2', // Assuming password is already hashed
      picturePath: '/public/assets/profile_janedoe.jpg'
    });

    await user1.save();
    await user2.save();

    // Create mock questions
    const question1 = new Question({
      userId: user1._id,
      questionText: 'What is the capital of France?',
      questionType: 'quiz',
      picture: '/public/assets/question_image.jpg',
      choices: [
        {
          choiceText: 'Paris',
          isCorrect: true,
          explanation: 'Paris is the capital of France.',
          choiceImage: '/public/assets/choice_paris.jpg'
        },
        {
          choiceText: 'London',
          isCorrect: false,
          choiceImage: '/public/assets/choice_london.jpg'
        },
        {
          choiceText: 'Berlin',
          isCorrect: false,
          choiceImage: '/public/assets/choice_berlin.jpg'
        }
      ],
      comments: [
        {
          userId: user2._id,
          commentText: 'Great question, very informative!'
        }
      ],
      likes: new Map([
        [user2._id.toString(), true]
      ])
    });

    const question2 = new Question({
      userId: user2._id,
      questionText: 'Which of these is a programming language?',
      questionType: 'poll',
      choices: [
        {
          choiceText: 'JavaScript',
          isCorrect: true,
          choiceImage: '/public/assets/choice_javascript.jpg'
        },
        {
          choiceText: 'HTML',
          isCorrect: false,
          choiceImage: '/public/assets/choice_html.jpg'
        },
        {
          choiceText: 'CSS',
          isCorrect: false,
          choiceImage: '/public/assets/choice_css.jpg'
        }
      ],
      comments: [
        {
          userId: user1._id,
          commentText: 'JavaScript is my favorite programming language!'
        }
      ],
      likes: new Map([
        [user1._id.toString(), true]
      ])
    });

    await question1.save();
    await question2.save();

    console.log('Mock data has been added successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
};

seedData();
