import express from 'express';
import Vote from '../models/vote.model.js';

// C-UD in one function
export const updateVote = async (req, res) => {
    try {
      const { userId, pollId, quizId, optionId } = req.body;
      console.log("Update Request Body:", req.body); // Debug request payload
  
      if (!userId || (!pollId && !quizId)) {
        return res.status(400).json({ message: "Missing required fields for updating vote" });
      }
  
      // Build the filter to find the existing vote
      const filter = { userId };
      if (pollId) filter.pollId = pollId;
      if (quizId) filter.quizId = quizId;
  
      // Find the existing vote
      const existingVote = await Vote.findOne(filter);
  
      if (!existingVote) {
        // Case 1: User hasn't answered this poll/quiz before => Create a new vote
        const newVote = new Vote({
          userId,
          pollId,
          quizId,
          optionId,
          type: pollId ? "Poll" : "Quiz", // Determine type based on pollId or quizId
        });
  
        await newVote.save();
        console.log("Create Vote!")
        return res.status(201).json({ message: "Vote created successfully", vote: newVote });
      }
      const existingVoteObjectIdString = existingVote.optionId.toString();
      console.log(existingVoteObjectIdString, "VS", optionId)
      if (existingVoteObjectIdString === optionId) {
        // Case 2: User has answered this poll/quiz before and the optionId is the same => Delete the vote
        await Vote.deleteOne(filter);
        console.log("Deleted Vote!")
        return res.status(200).json({ message: "Vote deleted successfully" });
      }
  
      // Case 3: User has answered this poll/quiz before and the optionId is different => Update the vote
      existingVote.optionId = optionId;
      await existingVote.save();
      console.log("Change Vote!")
      return res.status(200).json({ message: "Vote updated successfully", vote: existingVote });
    } catch (error) {
      console.error("Error in updateVote:", error.message);
      res.status(500).json({ message: "Error handling vote", error: error.message });
    }
  };

  
// -R-- function
// Return all optionId(s) that the current user has been voted.
export const getMyAnswers = async (req, res) => {
    try {
      console.log("getMyAnswers Request user:", req.user); // Debug user info
  
      const userId = req.user.id; // Use 'id' instead of '_id'
      if (!userId) {
        console.log("Missing userId");
        return res.status(400).json({ message: "User ID is missing" });
      }
  
      const votes = await Vote.find({ userId }).select("optionId -_id");
      if (!votes || votes.length === 0) {
        return //res.status(404).json({ message: "No votes found for the current user" });
      }
  
      const optionIds = votes.map((vote) => vote.optionId);
      console.log("Answered Option Data:", optionIds);

      res.status(200).json(optionIds);
    } catch (error) {
      console.error("Error in getMyAnswers:", error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
