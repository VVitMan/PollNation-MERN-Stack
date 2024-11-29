import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin  } from "../utils/verifyAdmin.js";
import { fetchAllUsers, getUserReports } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, fetchAllUsers); // fetch all users
router.get("/users/:id/reports", verifyToken, verifyAdmin, getUserReports);

export default router;