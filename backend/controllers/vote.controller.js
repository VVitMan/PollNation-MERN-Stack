import Vote from '../models/vote.model.js';
import Poll from '../models/poll.model.js';

export const createOrToggleVote = async (req, res) => {
    const { userId, pollId, optionIndex, type } = req.body;
    console.log("ToggleVote Request Body:", req.body); // Debug request payload

    try {
        // Check if the user has already voted on this poll
        const existingVote = await Vote.findOne({ userId, pollId });

        if (existingVote) {
            // Check if the user clicked the same option
            if (existingVote.optionIndex === optionIndex) {
                // Remove the vote and decrement the count
                await Vote.findByIdAndDelete(existingVote._id);

                const poll = await Poll.findById(pollId);
                if (!poll) {
                    return res.status(404).json({ message: 'Poll not found' });
                }

                poll.options[optionIndex].votes -= 1;
                await poll.save();

                return res.status(200).json({ message: 'Vote removed successfully', poll });
            } else {
                // Update the vote to a new option
                existingVote.optionIndex = optionIndex;
                await existingVote.save();

                const poll = await Poll.findById(pollId);
                if (!poll) {
                    return res.status(404).json({ message: 'Poll not found' });
                }

                // Decrement the previous option's count and increment the new one
                poll.options[existingVote.optionIndex].votes -= 1;
                poll.options[optionIndex].votes += 1;
                await poll.save();

                return res.status(200).json({ message: 'Vote updated successfully', poll });
            }
        } else {
            // Create a new vote
            const newVote = new Vote({ userId, pollId, optionIndex, type });
            await newVote.save();

            const poll = await Poll.findById(pollId);
            if (!poll) {
                return res.status(404).json({ message: 'Poll not found' });
            }

            poll.options[optionIndex].votes += 1;
            await poll.save();

            return res.status(201).json({ message: 'Vote recorded successfully', poll });
        }
    } catch (error) {
        console.error('Error handling vote:', error.message);
        res.status(500).json({ message: 'Error handling vote', error: error.message });
    }
};



// Update an existing vote
export const updateVote = async (req, res) => {
    try {
        const { userId, pollId, quizId, optionIndex } = req.body;
        console.log("Update Request Body:", req.body); // Debug request payload

        if (!userId || (!pollId && !quizId)) {
            return res.status(400).json({ message: 'Missing required fields for updating vote' });
        }

        const filter = { userId };
        if (pollId) filter.pollId = pollId;
        if (quizId) filter.quizId = quizId;

        const vote = await Vote.findOneAndUpdate(filter, { optionIndex }, { new: true });
        if (!vote) {
            return res.status(404).json({ message: 'Vote not found' });
        }

        res.status(200).json({ message: 'Vote updated successfully', vote });
    } catch (error) {
        res.status(500).json({ message: 'Error updating vote', error: error.message });
    }
};

export const deleteVote = async (req, res) => {
    const { userId, pollId } = req.body;

    try {
        const vote = await Vote.findOneAndDelete({ userId, pollId });
        if (!vote) {
            return res.status(404).json({ message: 'Vote not found' });
        }

        // Decrement the vote count for the corresponding option
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        poll.options[vote.optionIndex].votes -= 1; // Decrement the vote count
        await poll.save();

        res.status(200).json({ message: 'Vote removed successfully', poll });
    } catch (error) {
        console.error('Error deleting vote:', error.message);
        res.status(500).json({ message: 'Error deleting vote', error: error.message });
    }
};


// Fetch votes for a specific poll or quiz
export const getUserVotes = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming `verifyToken` middleware attaches `user` to `req`

        const votes = await Vote.find({ userId }).select("pollId optionIndex");
        res.status(200).json(votes);
    } catch (error) {
        console.error("Error fetching user votes:", error.message);
        res.status(500).json({ message: "Error fetching votes", error: error.message });
    }
};
