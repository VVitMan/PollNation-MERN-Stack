import User from "../models/user.model.js";
import Poll from "../models/poll.model.js";
import Vote from "../models/vote.model.js";
import { errorCustom } from "../utils/errorCustom.js";

// Test endpoint
export const testPoll = (req, res) => {
  res.status(200).json({ message: "Poll route is working!" });
};

// Create a new poll
export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    // Format options to ensure they are objects with a `text` field
    const formattedOptions = options.map((option) =>
      typeof option === "string" ? { text: option } : option
    );

    // Create poll
    const poll = new Poll({
      userId: req.user.id, // Use authenticated user's ID
      question,
      options: formattedOptions, // Save properly formatted options
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all polls
export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate(
      "userId",
      "username profilePicture"
    );
    // Filter out polls where `userId` is null (i.e., the user was deleted)
    // const filteredPolls = polls.filter(poll => poll.userId !== null);
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get polls created by the authenticated user
export const getUserPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ userId: req.user.id }).populate(
      "userId",
      "username profilePicture"
    );
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get polls of another user using username
export const getAnotherUserPolls = async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the password field before sending the response
    const { password, ...userWithoutPassword } = user._doc;

    // Fetch polls created by this user
    const polls = await Poll.find({ userId: user._id });

    res.status(200).json({ user: userWithoutPassword, polls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a vote to a poll
export const submitPollVote = async (req, res) => {
  try {
    const { poll_id } = req.params; // Poll ID
    const { optionIndex } = req.body; // Selected option index
    const userId = req.user.id; // Extract user ID from the token (via verifyToken middleware)

    // Check if the poll exists
    const poll = await Poll.findById(poll_id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    // Check if the user has already voted for this poll
    const existingVote = await Vote.findOne({ userId, pollId: poll_id });
    if (existingVote) {
      return res
        .status(403)
        .json({ message: 'You have already voted in this poll.' });
    }

    // Validate that the optionIndex is within bounds
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid option index' });
    }

    // Increment the vote count for the selected option in the poll
    poll.options[optionIndex].votes += 1;
    await poll.save();

    // Record the vote in the Vote model
    const vote = new Vote({
      userId,
      pollId: poll_id,
      optionIndex,
      type: 'Poll', // Add vote type
    });
    await vote.save();

    res.status(200).json({ poll, vote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a poll
export const editPoll = async (req, res) => {
  try {
    const { poll_id } = req.params; // Poll ID
    const { question, options } = req.body; // Updated question and options
    const userId = req.user.id; // User ID from token

    // Check if the poll exists
    const poll = await Poll.findById(poll_id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Check if the user is the owner of the poll
    if (poll.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this poll." });
    }

    // Update the poll's fields
    if (question) poll.question = question;
    if (options) {
      const formattedOptions = options.map((option) =>
        typeof option === "string" ? { text: option, votes: 0 } : option
      );
      poll.options = formattedOptions;
    }

    await poll.save();
    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a poll
export const deletePoll = async (req, res) => {
  try {
    const { poll_id } = req.params; // Poll ID
    const userId = req.user.id; // User ID from token

    // Check if the poll exists
    const poll = await Poll.findById(poll_id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Check if the user is the owner of the poll
    if (poll.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this poll." });
    }

    // Delete the poll and any associated votes
    await Poll.findByIdAndDelete(poll_id);
    await Vote.deleteMany({ pollId: poll_id });

    res.status(200).json({ message: "Poll deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
