import Vote from '../models/vote.model.js';
import Poll from '../models/poll.model.js';



export const getUserVotedChoices = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming verifyToken middleware sets req.user

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    // Fetch votes by the current user
    const votes = await Vote.find({ userId }).select('optionId -_id');

    if (!votes || votes.length === 0) {
      return res.status(404).json({ message: 'No votes found for the current user' });
    }

    // Extract the option IDs
    const optionIds = votes.map((vote) => vote.optionId);

    res.status(200).json({ message: 'User voted choices retrieved successfully', optionIds });
  } catch (error) {
    console.error('Error fetching user votes:', error.message);
    res.status(500).json({ message: 'Error fetching user votes', error: error.message });
  }
};
/**
 * Add a vote to a poll or quiz
 */
export const createVote = async (req, res) => {
  try {
    console.log("Create Request Body:", req.body); // Debug request payload
    const { userId, pollId, quizId, optionId, type } = req.body;

    if (!userId || !optionId || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the user has already voted for this option
    const existingVote = await Vote.findOne({
      userId,
      pollId,
      quizId,
      optionId,
      type,
    });

    if (existingVote) {
      return res.status(400).json({ message: "You have already voted for this option" });
    }

    // Save the vote
    const vote = new Vote({
      userId,
      pollId,
      quizId,
      optionId,
      type,
    });

    await vote.save();

    // Update the poll's votes if the vote is for a poll
    if (pollId) {
      const poll = await Poll.findById(pollId);

      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }

      const option = poll.options.find((opt) => opt._id.toString() === optionId);
      if (!option) {
        return res.status(400).json({ message: "Invalid optionId for poll" });
      }

      option.votes += 1;
      await poll.save();
    }

    res.status(201).json({ message: "Vote recorded successfully", vote });
  } catch (error) {
    console.error("Error in createVote:", error.message);
    res.status(500).json({ message: "Error recording vote", error: error.message });
  }
};

/**
 * Update an existing vote
 */
export const updateVote = async (req, res) => {
  try {
    const { userId, pollId, quizId, optionId } = req.body;
    console.log("Update Request Body:", req.body);

    if (!userId || (!pollId && !quizId) || !optionId) {
      return res.status(400).json({ message: 'Missing required fields for updating vote' });
    }

    const filter = { userId };
    if (pollId) filter.pollId = pollId;
    if (quizId) filter.quizId = quizId;

    const existingVote = await Vote.findOne(filter);

    if (!existingVote) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    // Adjust poll votes if changing an option in a poll
    if (pollId && existingVote.optionId !== optionId) {
      const poll = await Poll.findById(pollId);

      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }

      const oldOption = poll.options.find((opt) => opt._id.toString() === existingVote.optionId);
      const newOption = poll.options.find((opt) => opt._id.toString() === optionId);

      if (oldOption) oldOption.votes -= 1;
      if (newOption) newOption.votes += 1;

      await poll.save();
    }

    // Update the vote
    existingVote.optionId = optionId;
    await existingVote.save();

    res.status(200).json({ message: 'Vote updated successfully', vote: existingVote });
  } catch (error) {
    res.status(500).json({ message: 'Error updating vote', error: error.message });
  }
};

/**
 * Delete a vote
 */
export const deleteVote = async (req, res) => {
  try {
    const { userId, pollId, quizId } = req.body;
    console.log("Delete Request Body:", req.body);

    if (!userId || (!pollId && !quizId)) {
      return res.status(400).json({ message: 'Missing required fields for deleting vote' });
    }

    const filter = { userId };
    if (pollId) filter.pollId = pollId;
    if (quizId) filter.quizId = quizId;

    const vote = await Vote.findOne(filter);

    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    // Adjust poll votes if deleting a vote for a poll
    if (pollId) {
      const poll = await Poll.findById(pollId);

      if (poll) {
        const option = poll.options.find((opt) => opt._id.toString() === vote.optionId);
        if (option) option.votes -= 1;
        await poll.save();
      }
    }

    await Vote.deleteOne(filter);

    res.status(200).json({ message: 'Vote deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vote', error: error.message });
  }
};

/**
 * Fetch votes for a specific poll or quiz
 */
export const getVotes = async (req, res) => {
  try {
    const { pollId, quizId } = req.query;
    console.log("GetVotes Request Body:", req.body);

    const filter = {};
    if (pollId) filter.pollId = pollId;
    if (quizId) filter.quizId = quizId;

    const votes = await Vote.find(filter);
    res.status(200).json({ votes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching votes', error: error.message });
  }
};

/**
 * Get the optionId a user voted for in a specific poll
 */
export const getUserVoteForPoll = async (req, res) => {
  try {
    const { userId, pollId } = req.query;

    // Validate input
    if (!userId || !pollId) {
      return res.status(400).json({ message: 'Missing userId or pollId' });
    }

    // Find the vote for the given user and poll
    const vote = await Vote.findOne({ userId, pollId });

    if (!vote) {
      return res.status(404).json({ message: 'No vote found for this user in the specified poll' });
    }

    // Return the optionId
    res.status(200).json({
      message: 'Vote retrieved successfully',
      optionId: vote.optionId,
    });
  } catch (error) {
    console.error('Error fetching user vote:', error.message);
    res.status(500).json({ message: 'Error fetching user vote', error: error.message });
  }
};
