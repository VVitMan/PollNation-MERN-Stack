import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin  } from "../utils/verifyAdmin.js";
import { fetchAllUsers, getUserReports, deleteUser, banUser, unbanUser } from "../controllers/admin.controller.js";

const router = express.Router();

/* Get All User */
router.get("/users", verifyToken, verifyAdmin, fetchAllUsers);
/* Get User Reports */
router.get("/users/:id/reports", verifyToken, verifyAdmin, getUserReports);
/* Delete User */
router.delete("/users/:userId", verifyToken, verifyAdmin, deleteUser);
/* Ban User */
router.patch("/users/:userId/ban", verifyToken, verifyAdmin, banUser);
/* Unban User */
router.patch("/users/:userId/unban", verifyToken, verifyAdmin, unbanUser);

export default router;
