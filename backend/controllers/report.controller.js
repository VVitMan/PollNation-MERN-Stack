import Report from "../models/report.model.js";
import User from "../models/user.model.js";

// Controller for handling report-related operations
const reportController = {
  // Submit a report
  submitReport: async (req, res) => {
    try {
      const { reportedUserId, reason } = req.body;

      // Check if the reported user exists
      const reportedUser = await User.findById(reportedUserId);
      if (!reportedUser) {
        return res.status(404).json({ message: 'Reported user not found.' });
      }

      // Create the report
      const report = new Report({
        reportedUserId,
        reporterUserId: req.user.id, // Assuming the reporter's ID comes from authenticated user
        reason,
      });
      await report.save();

      // Increment the report count for the reported user
      reportedUser.reportCount += 1;
      await reportedUser.save();

      return res.status(201).json({ message: 'Report submitted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error submitting the report.' });
    }
  },

  // Fetch reported users (for admin)
  getReportedUsers: async (req, res) => {
    try {
      // Ensure only admins can access this
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied.' });
      }

      // Fetch users sorted by report count
      const reportedUsers = await User.find({ reportCount: { $gt: 0 } })
        .sort({ reportCount: -1 })
        .select('username email reportCount isBanned');

      res.status(200).json(reportedUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching reported users.' });
    }
  },

  // Ban or unban a user
  toggleBanUser: async (req, res) => {
    try {
      const { userId } = req.body;

      // Ensure only admins can perform this action
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied.' });
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Toggle the ban status
      user.isBanned = !user.isBanned;
      await user.save();

      res.status(200).json({
        message: `User has been ${user.isBanned ? 'banned' : 'unbanned'} successfully.`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error toggling ban status.' });
    }
  },
};

module.exports = reportController;
