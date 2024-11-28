import { errorCustom } from "../utils/errorCustom.js";
import bcryptjs from "bcryptjs";
import Report from "../models/report.model.js";
import User from "../models/user.model.js";
import Report from "../models/report.model.js";

export const test = (req, res) => {
    res.json({
        message: "user vit from controller"
    });
};

/* Update User */
export const updateUser = async (req, res, next) => {
    /* ตอนเราสร้าง access_token เราใช้ payload เป็น { id: user._id } คือ id ของ user*/
    if (req.user.id !== req.params.id) {
        return next(errorCustom(401, "You can update only your account"));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 12);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,                
                    email: req.body.email,
                    password: req.body.password,
                    description: req.body.description,
                    profilePicture: req.body.profilePicture,
                }
            }, { new: true }
        );
        /* remove password before sent to client side */
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
        console.log(rest);

    } catch (error) {
        next(error);
    }
};

/* Delete User */
export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorCustom(401, "You can delete only your account"));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

/* Get ID by name */
export const getId = async (req, res, next) => {
    try {
        const { username } = req.params; // Directly extract `username` from `req.params`

        // Find the user by their username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(res.status(200).json({ userId: user._id }))
        res.status(200).json({ userId: user._id }); // Return the user's ID
    } catch (error) {
        console.error("Error fetching user ID:", error);
        next(error); // Pass the error to the error-handling middleware
    }
}

/* Report System */
// Submit a report against a user
export const submitReport = async (req, res, next) => {
    const { reportedUserId, reason } = req.body;

    if (!reportedUserId || !reason) {
        return res.status(400).json({ message: "Missing required fields: reportedUserId and reason." });
    }

    try {
        const reportedUser = await User.findById(reportedUserId);
        if (!reportedUser) {
            return res.status(404).json({ message: "Reported user not found." });
        }

        if (req.user.id === reportedUserId) {
            return res.status(400).json({ message: "You cannot report yourself." });
        }

        const report = new Report({
            reportedUserId,
            reporterUserId: req.user.id,
            reason,
        });

        await report.save();
        res.status(201).json({ message: "Report submitted successfully." });
    } catch (error) {
        console.error("Error submitting report:", error);
        next(error);
    }
};


/* V -------------- Admin System -------------- V */
/* Admin-Specific: Fetch User Details */
export const getUserDetails = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(errorCustom(403, "Access denied"));
        }

        const { userId } = req.params;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return next(errorCustom(404, "User not found"));
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/* Admin-Specific: Promote User to Admin */
export const promoteToAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(errorCustom(403, "Access denied"));
        }

        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return next(errorCustom(404, "User not found"));
        }

        user.isAdmin = true;
        await user.save();

        res.status(200).json({ message: "User has been promoted to admin" });
    } catch (error) {
        next(error);
    }
};

/* Admin-Specific: Delete User */
export const adminDeleteUser = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(errorCustom(403, "Access denied"));
        }

        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return next(errorCustom(404, "User not found"));
        }

        res.status(200).json({ message: "User has been deleted successfully" });
    } catch (error) {
        next(error);
    }
};

/* Admin-Specific: Toggle User Ban */
export const toggleBanUser = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(errorCustom(403, "Access denied"));
        }

        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return next(errorCustom(404, "User not found"));
        }

        user.isBanned = !user.isBanned;
        await user.save();

        res.status(200).json({
            message: `User has been ${user.isBanned ? "banned" : "unbanned"} successfully`,
        });
    } catch (error) {
        next(error);
    }
};

/* Admin-Specific: */
export const getReportedUsers = async (req, res, next) => {
    try {
        // Aggregate reports to group by reported user, count reports, and fetch reasons/reporters
        const reports = await Report.aggregate([
            {
                $group: {
                    _id: "$reportedUserId", // Group by reportedUserId
                    count: { $sum: 1 }, // Count the number of reports
                    reasons: { $push: "$reason" }, // Collect reasons for reports
                    reporters: { $push: "$reporterUserId" }, // Collect reporter IDs
                },
            },
            {
                $lookup: {
                    from: "users", // Join with User collection
                    localField: "_id", // Match reportedUserId
                    foreignField: "_id", // Match with users' _id
                    as: "userDetails", // Add user details to the result
                },
            },
            {
                $sort: { count: -1 }, // Sort by the number of reports in descending order
            },
        ]);

        res.status(200).json(reports); // Send the aggregated reports as a response
    } catch (error) {
        console.error("Error fetching reported users:", error);
        next(error); // Pass the error to the error-handling middleware
    }
};