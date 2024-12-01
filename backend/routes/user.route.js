import express from "express";
import {
    updateUser,
    deleteUser,
    submitReport, // Import the report submission handler
    getId,
    verifyPassword,
} from "../controllers/user.controller.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/id/:username", verifyToken, getId);
router.put("/update/:id", verifyToken, updateUser); // User update
router.delete("/delete/:id", verifyToken, deleteUser); // User delete
router.post("/verify-password", verifyToken, verifyPassword)




// Define the POST route for `/reports`
// Report Submission
router.post("/reports", verifyToken, submitReport); // Submit report against a user

export default router;