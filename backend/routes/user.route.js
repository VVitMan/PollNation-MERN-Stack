import express from "express";
import {
    test,
    updateUser,
    deleteUser,
    getUserDetails,
    promoteToAdmin,
    adminDeleteUser,
    toggleBanUser,
    getId,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin  } from "../utils/verifyAdmin.js";
import { submitReport } from "../controllers/user.controller.js";
import { getReportedUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", test) // Test route
router.get("/id/:username", verifyToken, getId);


router.put("/update/:id", verifyToken, updateUser); // User update
router.delete("/delete/:id", verifyToken, deleteUser); // User delete

// Admin-Specific Routes
router.get("/admin/:userId", verifyToken, verifyAdmin, getUserDetails); // Admin fetches user details
router.post("/admin/promote", verifyToken, verifyAdmin, promoteToAdmin); // Admin promotes a user to admin
router.delete("/admin/delete/:userId", verifyToken, verifyAdmin, adminDeleteUser); // Admin deletes a user
router.post("/admin/toggle-ban", verifyToken, verifyAdmin, toggleBanUser); // Admin bans/unbans a user

// Define the POST route for `/reports`
router.post("/reports", verifyToken, submitReport);

export default router;