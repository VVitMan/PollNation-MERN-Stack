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
// Return all optionId(s) that the current user has been voted.
export const getMyAnswers = async (req, res) => {
    try {
      console.log("getMyAnswers Request user:", req.user); // Debug user info
  
      const userId = req.user.id; // Use 'id' instead of '_id'
      if (!userId) {
        console.log("Missing userId");
        return res.status(400).json({ message: "User ID is missing" });
      }
  
      // Fetch votes and include optionId, pollId, and quizId in the result
    const votes = await Vote.find({ userId }).select("optionId pollId quizId -_id");

    if (!votes || votes.length === 0) {
      return res.status(404).json({ message: "No votes found for the current user" });
    }

    // Extract option IDs and question IDs
    const allOptionIdData = votes.map((vote) => vote.optionId.toString());
    const allQuestionIdData = votes.map((vote) => vote.pollId?.toString() || vote.quizId?.toString());


    console.log("getMyAnswers Respond with =>\n","Poll IDs: ", allOptionIdData," \nQuestion IDs: ", allQuestionIdData,); // Debug user info

    // Send the combined response
    res.status(200).json({
      allOptionIdData,
      allQuestionIdData,
    });
    } catch (error) {
      console.error("Error in getMyAnswers:", error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
