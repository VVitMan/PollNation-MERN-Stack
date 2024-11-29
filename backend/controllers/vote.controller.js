import Vote from '../models/vote.model.js';

// Add a vote to a poll or quiz
export const createVote = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debug request payload
        const { userId, pollId, quizId, optionIndex, type } = req.body;
        
        if (!userId || optionIndex === undefined || !type) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (typeof optionIndex !== "number") {
            return res.status(400).json({ message: "Invalid optionIndex: must be a number" });
        }

        const vote = new Vote({
            userId,
            pollId,
            quizId,
            optionIndex,
            type,
        });

        await vote.save();
        res.status(201).json({ message: "Vote recorded successfully", vote });
    } catch (error) {
        console.error("Error in createVote:", error.message);
        res.status(500).json({ message: "Error recording vote", error: error.message });
    }
};



// Update an existing vote
export const updateVote = async (req, res) => {
    try {
        const { userId, pollId, quizId, optionIndex } = req.body;

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

// Delete a vote
export const deleteVote = async (req, res) => {
    try {
        const { userId, pollId, quizId } = req.body;

        if (!userId || (!pollId && !quizId)) {
            return res.status(400).json({ message: 'Missing required fields for deleting vote' });
        }

        const filter = { userId };
        if (pollId) filter.pollId = pollId;
        if (quizId) filter.quizId = quizId;

        const result = await Vote.deleteOne(filter);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Vote not found' });
        }

        res.status(200).json({ message: 'Vote deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vote', error: error.message });
    }
};

// Fetch votes for a specific poll or quiz
export const getVotes = async (req, res) => {
    try {
        const { pollId, quizId } = req.query;

        const filter = {};
        if (pollId) filter.pollId = pollId;
        if (quizId) filter.quizId = quizId;

        const votes = await Vote.find(filter);
        res.status(200).json({ votes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching votes', error: error.message });
    }
};
