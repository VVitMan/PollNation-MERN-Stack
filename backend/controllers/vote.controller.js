import express from 'express';
import Vote from '../models/vote.model.js';
import mongoose from 'mongoose';

// C-UD in one function
export const updateVote = async (req, res) => {
    try {
        const { userId, postId, optionId } = req.body;

        console.log("Update Request Body:", req.body); // Debug request payload
        
        // Validate input
        if (!userId || (!postId) || !optionId) {
          return res.status(400).json({ message: "Missing required fields for updating vote" });
        }
        
        // Build filter to find the existing vote (exclude optionId)
        const filter = {
          userId,
          ...(postId && { postId }), // Include postId if it exists
        };
        
        // Validate required fields
        if (!postId) {
          return res.status(400).json({ message: "Either postId or  must be provided" });
        }
        
        // Find existing vote
        const existingVote = await Vote.findOne(filter);
        
        if (!existingVote) {
          // Case 1: User hasn't answered this poll/quiz before => Create a new vote
          const newVote = new Vote({
            userId,
            postId: postId || null, // Set postId or null
            optionId, // Set optionId
          });
        
          await newVote.save();
          console.log("Created Vote!");
          return res.status(201).json({ message: "Vote created successfully", vote: newVote });
        }
        
        // Case 2: User has answered this poll/quiz before
        const existingVoteObjectIdString = existingVote.optionId.toString();
        console.log(existingVoteObjectIdString, "VS", optionId);
        
        if (existingVoteObjectIdString === optionId) {
          // If the same optionId is selected, delete the vote
          await Vote.deleteOne(filter);
          console.log("Deleted Vote!");
          return res.status(200).json({ message: "Vote deleted successfully" });
        }
        
        // Case 3: User has answered but selected a different option => Update the vote
        existingVote.optionId = optionId;
        await existingVote.save();
        console.log("Updated Vote!");
        return res.status(200).json({ message: "Vote updated successfully", vote: existingVote });
        
    } catch (error) {
      console.error("Error in updateVote:", error.message);
      res.status(500).json({ message: "Error handling vote", error: error.message });
    }
  };
  

  
// -R-- function
// Returns Answered Option-IDs, Question-IDs, voted-counts
export const getMyAnswers = async (req, res) => {
    try {
      console.log("getMyAnswersWithCounts Request user:", req.user); // Debug user info
  
      const userId = req.user.id; // Use 'id' instead of '_id'
      if (!userId) {
        console.log("Missing userId");
        return res.status(400).json({ message: "User ID is missing" });
      }
  
      // Fetch user votes
      const votes = await Vote.find({ userId }) // Replace `userId` with the actual userId variable
      .select('optionId postId -_id')
      .lean(); // Convert Mongoose objects to plain JavaScript objects
  
      // Handle no votes case
      if (!votes || votes.length === 0) {
        return res.status(204).json({ message: "No votes found for the current user" });
      }
      
      // Extract option IDs and question IDs
      const allOptionIdData = votes.map((vote) => vote.optionId.toString());
      const allQuestionIdData = votes.map((vote) => vote.postId?.toString());
  
      // Get all postId for which to calculate vote counts
      const postId = votes.filter((vote) => vote.postId).map((vote) => vote.postId);
  

      // Build match criteria for aggregation
      const matchCriteria = [];
      if (postId.length > 0) matchCriteria.push({ postId: { $in: postId } });
  
      const voteCounts = await Vote.aggregate([
        { $match: { postId: { $in: postId } } }, // Match postId for polls
        {
          $group: {
            _id: "$optionId", // Group by optionId
            count: { $sum: 1 }, // Count the number of votes
          },
        },
      ]);
      console.log("Vote Counts:", voteCounts);
  
      // Combine user answers and vote counts into one response
      res.status(200).json({
        allOptionIdData,
        allQuestionIdData,
        voteCounts,
      });
    } catch (error) {
      console.error("Error in getMyAnswers(WithCounts):", error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  