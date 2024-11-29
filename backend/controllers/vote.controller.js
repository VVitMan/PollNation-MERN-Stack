import Vote from '../models/vote.model.js';
import Poll from '../models/poll.model.js';

export const createVote = async (req, res) => {
    const { userId, pollId, optionIndex, type } = req.body;
    console.log("Create Vote Request:", req.body);


    try {
        // Check if the poll exists
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Create a new vote
        const newVote = new Vote({ userId, pollId, optionIndex, type });
        await newVote.save();

        // Increment the vote count for the selected option
        poll.options[optionIndex].votes += 1;
        await poll.save();

        res.status(201).json({ message: 'Vote created successfully', poll });
    } catch (error) {
        console.error('Error creating vote:', error.message);
        res.status(500).json({ message: 'Error creating vote', error: error.message });
    }
};




// Update an existing vote
export const updateVote = async (req, res) => {
    const { userId, pollId, optionIndex } = req.body;
    console.log("Update Vote Request:", req.body);

    try {
        // Ensure required fields are provided
        if (!userId || !pollId) {
            return res.status(400).json({ message: 'Missing required fields for updating vote' });
        }

        // Find the existing vote for this user and poll
        const existingVote = await Vote.findOne({ userId, pollId });
        if (!existingVote) {
            return res.status(404).json({ message: 'Vote not found' });
        }

        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        if (existingVote.optionIndex === optionIndex) {
            // If the user clicks the same option, toggle it off (delete the vote)
            await Vote.findByIdAndDelete(existingVote._id);
            console.log("Deleted Vote ##########");

            // Decrement the vote count for the option
            poll.options[optionIndex].votes -= 1;
            await poll.save();

            return res.status(200).json({ message: 'Vote removed successfully', poll });
        } else {
            // If the user clicks a different option, update the vote
            const previousOptionIndex = existingVote.optionIndex;
            existingVote.optionIndex = optionIndex;
            await existingVote.save();
            console.log("Changed Vote Option ##########");

            // Update vote counts
            poll.options[previousOptionIndex].votes -= 1; // Decrement the previous option count
            poll.options[optionIndex].votes += 1; // Increment the new option count
            await poll.save();

            return res.status(200).json({ message: 'Vote updated successfully', poll });
        }
    } catch (error) {
        console.error('Error updating vote:', error.message);
        res.status(500).json({ message: 'Error updating vote', error: error.message });
    }
};



export const deleteVote = async (req, res) => {
    const { userId, pollId } = req.body;
    console.log("Delete Vote Request:", req.body);

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
