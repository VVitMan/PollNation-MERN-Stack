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
  