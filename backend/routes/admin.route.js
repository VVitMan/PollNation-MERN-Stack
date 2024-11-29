import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin  } from "../utils/verifyAdmin.js";
import { fetchAllUsers, getUserReports, deleteUser, banUser } from "../controllers/admin.controller.js";

const router = express.Router();

/* Get All User */
router.get("/users", verifyToken, verifyAdmin, fetchAllUsers);
/* Get User Reports */
router.get("/users/:id/reports", verifyToken, verifyAdmin, getUserReports);
/* Delete User */
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);
/* Ban User */
router.patch("/users/:id/ban", verifyToken, verifyAdmin, banUser);

export default router;