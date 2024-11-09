import express from "express";

// import controller
import { getUser } from "../controllers/users.js";
// tutorial getUserFriends, addRemoveFriends
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser); // => users/:id
// router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
// router.patch("/:id/:friendId", verifyToken, addRemoveFriends);

export default router;