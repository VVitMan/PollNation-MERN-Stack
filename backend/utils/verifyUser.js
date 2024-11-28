import jwt from "jsonwebtoken";
import { errorCustom } from "./errorCustom.js";
import User from "../models/user.model.js"; // Import User model for additional checks (if needed)

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorCustom(401, "You are not authenticated!!"));

    // Verify Token using JWT_SECRET from .env file
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return next(errorCustom(403, "Invalid Token"));

        try {
            // Retrieve full user details (e.g., role) from the database if needed
            const user = await User.findById(decoded.id).select("-password"); // Exclude password from fetched data
            if (!user) return next(errorCustom(404, "User not found"));

            req.user = user; // Attach the user object to the request
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error("Error in verifyToken:", error);
            next(errorCustom(500, "Internal server error during token verification"));
        }
    });
};
