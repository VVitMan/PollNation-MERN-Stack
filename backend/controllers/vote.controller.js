import express from 'express';
import Vote from '../models/vote.model.js';

// Add a vote to a poll or quiz
export const createVote = async (req, res) => {
    try {
        console.log("Create Request Body:", req.body); // Debug request payload
        const { userId, pollId, quizId, optionId, type } = req.body;
        
        if (!userId || optionId === undefined || !type) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const vote = new Vote({
            userId,
            pollId,
            quizId,
            optionId,
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
        const { userId, pollId, quizId, optionId } = req.body;
        console.log("Update Request Body:", req.body); // Debug request payload

        if (!userId || (!pollId && !quizId)) {
            return res.status(400).json({ message: 'Missing required fields for updating vote' });
        }

        const filter = { userId };
        if (pollId) filter.pollId = pollId;
        if (quizId) filter.quizId = quizId;

        const vote = await Vote.findOneAndUpdate(filter, { optionId }, { new: true });
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
        console.log("Delete Request Body:", req.body); // Debug request payload

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
export const getAnswered = async (req, res) => {
    try {
        const { pollId, quizId } = req.query;
        console.log("Incoming - getAnswered Request"); // Debug request payload

        const filter = {};
        if (pollId) filter.pollId = pollId;
        if (quizId) filter.quizId = quizId;

        const votes = await Vote.find(filter);
        res.status(200).json({ votes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching votes', error: error.message });
    }
};

// Return all optionId(s) that the current user has been voted.
export const getMyAnswers = async (req, res) => {
    try {
      console.log("Request user:", req.user); // Debug user info
  
      const userId = req.user.id; // Use 'id' instead of '_id'
      if (!userId) {
        console.log("Missing userId");
        return res.status(400).json({ message: "User ID is missing" });
      }
  
      const votes = await Vote.find({ userId }).select("optionId -_id");
      if (!votes || votes.length === 0) {
        return res.status(404).json({ message: "No votes found for the current user" });
      }
  
      const optionIds = votes.map((vote) => vote.optionId);
      console.log("Answered Option Data:", answeredOptionData);

      res.status(200).json(optionIds);
    } catch (error) {
      console.error("Error in getMyAnswers:", error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
