import { errorCustom } from "../utils/errorCustom.js";
import User from "../models/user.model.js";
import Report from "../models/report.model.js";

export const fetchAllUsers = async (req, res, next) => {
    try {
      // Fetch all users from the User model
      const users = await User.find({}, "_id username email profilePicture isBanned isAdmin"); // Exclude password field for security
  
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      next(error);
    }
};

export const getUserReports = async (req, res, next) => {
    try {
      const { id } = req.params;
      const reports = await Report.find({ reportedUserId: id })
        .populate("reporterUserId", "username email profilePicture"); // Include reporter details
      res.status(200).json(reports);
    } catch (error) {
      next(error);
    }
};

/* Delete User */
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
      // Validate userId
      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ error: 'Invalid userId format.' });
      }

      // Find and delete the user
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      res.status(200).json({ message: 'User account deleted successfully.' });
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user.' });
  }
};

/* Ban User */
export const banUser = async (req, res) => {
  const { userId } = req.params;

  try {
      // Validate userId
      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ error: 'Invalid userId format.' });
      }

      // Update the user's isBanned field
      const user = await User.findByIdAndUpdate(
          userId,
          { isBanned: true },
          { new: true }
      );

      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      res.status(200).json({ message: 'User has been banned successfully.' });
  } catch (error) {
      console.error('Error banning user:', error);
      res.status(500).json({ error: 'Failed to ban user.' });
  }
};