import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin  } from "../utils/verifyAdmin.js";
import { fetchAllUsers } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, fetchAllUsers); // fetch all users


export default router;