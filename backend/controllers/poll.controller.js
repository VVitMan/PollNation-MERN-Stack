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
            typeof option === 'string' ? { text: option } : option
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
    const polls = await Poll.find();
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get polls created by the authenticated user
export const getUserPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ userId: req.user.id });
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      if (!poll) return res.status(404).json({ message: "Poll not found" });

      // Check if the user has already voted for this poll
      const existingVote = await Vote.findOne({ userId, pollId: poll_id });
      if (existingVote) {
          return res.status(403).json({ message: "You have already voted in this poll." });
      }

      // Validate that the optionIndex is within bounds
      if (optionIndex < 0 || optionIndex >= poll.options.length) {
          return res.status(400).json({ message: "Invalid option index" });
      }

      // Increment the vote count for the selected option in the poll
      poll.options[optionIndex].votes += 1;
      await poll.save();

      // Record the vote in the Vote model
      const vote = new Vote({
          userId,
          pollId: poll_id,
          optionIndex,
      });
      await vote.save();

      res.status(200).json({ poll, vote });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
