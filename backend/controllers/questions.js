// CONTROLLERS (controllers/question.js)
import Question from '../models/Question.js';
import User from '../models/User.js';

/* CREATE QUESTION */
export const createQuestion = async (req, res) => {
  try {
    const { userId, questionText, picturePatch } = req.body;
    const user = await User.findById(userId);
    const newQuestion = new Question({
      userId,
      firstName: user.firstname,
      lastName: user.lastName,
      questionText,
      userPicturePath: user.picturePatch,
      picturePatch, //qustion picture
      likes: {},
      comments: []
    })

    await newQuestion.save();

    // return latest question in db that just been created => frontend display
    const question = await Question.find();
    res.status(201).json(question);

  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
/* read all question in db */
export const getFeedQuestions = async (req, res) => {
  try {
    // return latest question in db that just been created => frontend display
    const question = await Question.find();
    res.status(200).json(question);
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
}
/* read all question in db by userId */
export const getUserQuestions = async (req, res) => {
  try {
    // grab userId
    const { userId } = req.params;
    // return latest question of that user in db => frontend display
    const question = await Question.find({ userId });
    res.status(200).json(question);
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
}

/* UPDATE */
export const likeQuestion = async (req, res) => {
  try {
    const { id } = req.params; // grap relevant question
    const { userId } = req.body;
    const question = await Question.findById(id);
    const isLiked = question.likes.get(userId);

    if (isLiked) {
      question.likes.delete(userId); // if used to like that comment before will be remove like
    } else {
      question.likes.set(userId, true);
    }

    // update specific likes question
    const updatedQuestion = await Question.findByIdAndUpdate(
      id, { likes: question.likes }, { new: true }
    )

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
}


// ChatGPT
/* // CREATE a new question
export const createQuestion = async (req, res) => {
  try {
    // const { userId, questionText, questionType, choices, picture } = req.body;

    const newQuestion = new Question({
      userId,
      questionText,
      questionType,
      choices: choices.map(choice => ({
        choiceText: choice.choiceText,
        isCorrect: choice.isCorrect,
        explanation: choice.explanation,
        choiceImage: choice.choiceImage // Add choice image if provided
      })),
      picture,
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// READ a question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id)
      .populate('userId', 'username firstName lastName profilePicture')
      .populate('comments.userId', 'username firstName lastName profilePicture');
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ all questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('userId', 'username firstName lastName profilePicture')
      .populate('comments.userId', 'username firstName lastName profilePicture');
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a question by ID
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE a question by ID
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LIKE a question
export const likeQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    
    if (question.likes.includes(userId)) {
      question.likes = question.likes.filter((like) => like.toString() !== userId);
    } else {
      question.likes.push(userId);
    }
    
    const updatedQuestion = await question.save();
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 */