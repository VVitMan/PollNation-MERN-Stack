import express from 'express';
import Vote from '../models/vote.model.js';

// C-UD in one function
export const updateVote = async (req, res) => {
    try {
      const { userId, pollId, quizId, optionId } = req.body;
  
      console.log("Update Request Body:", req.body); // Debug request payload
  
      // Validate input
      if (!userId || (!pollId && !quizId)) {
        return res.status(400).json({ message: "Missing required fields for updating vote" });
      }
  
      // Build filter to find the existing vote
      const filter = { userId };
      if (pollId) filter.pollId = pollId;
      if (quizId) filter.quizId = quizId;
  
      // Find existing vote
      const existingVote = await Vote.findOne(filter);
  
      if (!existingVote) {
        // Case 1: User hasn't answered this poll/quiz before => Create a new vote
        const newVote = new Vote({
          userId,
          pollId: pollId || null, // Set pollId or null
          quizId: quizId || null, // Set quizId or null
          optionId,
          type: pollId ? "Poll" : "Quiz", // Determine type based on pollId or quizId
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
      const votes = await Vote.find({ userId }).select("optionId pollId quizId -_id");
  
      // Handle no votes case
      if (!votes || votes.length === 0) {
        return res.status(404).json({ message: "No votes found for the current user" });
      }
  
      // Extract option IDs and question IDs
      const allOptionIdData = votes.map((vote) => vote.optionId.toString());
      const allQuestionIdData = votes.map((vote) => vote.pollId?.toString() || vote.quizId?.toString());
  
      // Get all pollIds and quizIds for which to calculate vote counts
      const pollIds = votes.filter((vote) => vote.pollId).map((vote) => vote.pollId);
      const quizIds = votes.filter((vote) => vote.quizId).map((vote) => vote.quizId);
  
      // Build match criteria for aggregation
      const matchCriteria = [];
      if (pollIds.length > 0) matchCriteria.push({ pollId: { $in: pollIds } });
      if (quizIds.length > 0) matchCriteria.push({ quizId: { $in: quizIds } });
  
      const combinedCriteria = matchCriteria.length > 1 ? { $or: matchCriteria } : matchCriteria[0];
  
      // Aggregate vote counts per option
      const voteCounts = await Vote.aggregate([
        { $match: combinedCriteria }, // Match votes for user's polls and quizzes
        {
          $group: {
            _id: "$optionId", // Group by optionId
            count: { $sum: 1 }, // Count the number of votes
          },
        },
        {
          $lookup: {
            from: "options", // Assuming the collection for options is named 'options'
            localField: "_id",
            foreignField: "_id",
            as: "optionDetails",
          },
        },
        { $unwind: "$optionDetails" }, // Flatten the optionDetails array
        {
          $project: {
            optionId: "$_id",
            count: 1,
            text: "$optionDetails.text", // Include option text
          },
        },
      ]);
  
      // Combine user answers and vote counts into one response
      res.status(200).json({
        allOptionIdData,
        allQuestionIdData,
        voteCounts,
      });
    } catch (error) {
      console.error("Error in getMyAnswersWithCounts:", error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };