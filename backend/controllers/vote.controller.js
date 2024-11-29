import Vote from '../models/vote.model.js';
import Poll from '../models/poll.model.js';

/**
 * Add a vote to a poll or quiz
 */
export const createVote = async (req, res) => {
    try {
        console.log("Create Request Body:", req.body); // Debug request payload
        const { userId, pollId, quizId, optionIndex, type } = req.body;

        if (!userId || optionIndex === undefined || !type) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (typeof optionIndex !== "number") {
            return res.status(400).json({ message: "Invalid optionIndex: must be a number" });
        }

        // Save the vote
        const vote = new Vote({
            userId,
            pollId,
            quizId,
            optionIndex,
            type,
        });

        await vote.save();

        // Update the poll's votes if the vote is for a poll
        if (pollId) {
            const poll = await Poll.findById(pollId);

            if (!poll) {
                return res.status(404).json({ message: "Poll not found" });
            }

            if (optionIndex < 0 || optionIndex >= poll.options.length) {
                return res.status(400).json({ message: "Invalid option index for poll" });
            }

            poll.options[optionIndex].votes += 1;
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
        const { userId, pollId, quizId, optionIndex } = req.body;
        console.log("Update Request Body:", req.body);

        if (!userId || (!pollId && !quizId)) {
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
        if (pollId && existingVote.optionIndex !== optionIndex) {
            const poll = await Poll.findById(pollId);

            if (!poll) {
                return res.status(404).json({ message: "Poll not found" });
            }

            // Decrement vote from the old option
            poll.options[existingVote.optionIndex].votes -= 1;

            // Increment vote for the new option
            poll.options[optionIndex].votes += 1;

            await poll.save();
        }

        // Update the vote
        existingVote.optionIndex = optionIndex;
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
                poll.options[vote.optionIndex].votes -= 1;
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
 * Get the optionIndex a user voted for in a specific poll
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

        // Return the optionIndex
        res.status(200).json({
            message: 'Vote retrieved successfully',
            optionIndex: vote.optionIndex,
        });
    } catch (error) {
        console.error('Error fetching user vote:', error.message);
        res.status(500).json({ message: 'Error fetching user vote', error: error.message });
    }
};
