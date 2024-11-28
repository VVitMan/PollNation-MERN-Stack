import express from "express";
import {
    test,
    updateUser,
    deleteUser,
    getUserDetails,
    promoteToAdmin,
    adminDeleteUser,
    toggleBanUser,
    submitReport, // Import the report submission handler
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin  } from "../utils/verifyAdmin.js";

const router = express.Router();

router.get("/", test) // Test route
router.put("/update/:id", verifyToken, updateUser); // User update
router.delete("/delete/:id", verifyToken, deleteUser); // User delete

// Admin-Specific Routes
router.get("/admin/:userId", verifyToken, verifyAdmin, getUserDetails); // Admin fetches user details
router.post("/admin/promote", verifyToken, verifyAdmin, promoteToAdmin); // Admin promotes a user to admin
router.delete("/admin/delete/:userId", verifyToken, verifyAdmin, adminDeleteUser); // Admin deletes a user
router.post("/admin/toggle-ban", verifyToken, verifyAdmin, toggleBanUser); // Admin bans/unbans a user

// Report Submission
router.post("/reports", verifyToken, submitReport); // Submit report against a user

export default router;