import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
    userId: { type: String, required: true },
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    questionText: { type: String },
    picturePath: { type: String, default: "" }, // picture for question
    userPicturePath: { type: String }, // user picture
    comments: { type: Array, default: []},
    likes: { type: Map, of: Boolean, default: {} } // Map for likes, use dictionary
    }, 
    { timestamps: true }
);
  
  
const Question = mongoose.model('Question', questionSchema);
  
export default Question;

// Update choiceSchema to include an image for each choice
// provide by chatGPT4
/* const choiceSchema = new mongoose.Schema({
    choiceText: { type: String, required: true },
    isCorrect: { type: Boolean }, // Only relevant for quizzes
    explanation: { type: String, default: "" }, // Optional, for correct answers in quizzes
    choiceImage: { type: String, default: "" } // Optional image for the choice
}); */
  
// provide by chatGPT4
/* const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentText: { type: String, required: true },
    commentedAt: { type: Date, default: Date.now }
}); */

/* const questionSchema = new mongoose.Schema(
    {
    // by chatGPT4
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionText: { type: String },
    questionType: { type: String, enum: ['poll', 'quiz'], required: true },
    picturePatch: { type: String, default: "" },
    userPicturePatch: { type: String },
    // provide by chatGPT4
    choices: [choiceSchema],
    comments: { type: Array, default: []},
    likes: { type: Map, of: Boolean, default: {} } // Map for likes
    }, 
    { timestamps: true }
); */
  

  