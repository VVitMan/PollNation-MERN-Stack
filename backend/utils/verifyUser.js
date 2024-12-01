import jwt from "jsonwebtoken";
import { errorCustom } from "./errorCustom.js";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorCustom(401, "You are not authenticated!!"));

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user details from the database
        const user = await User.findById(decoded.id).select("-password"); // Exclude password
        if (!user) return next(errorCustom(404, "User not found"));

        // Attach user to the request object
        req.user = user;

        next(); // Proceed to the next middleware or route
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return next(errorCustom(403, "Invalid Token"));
        } else if (err.name === "TokenExpiredError") {
            return next(errorCustom(401, "Token has expired"));
        } else {
            console.error("Error in verifyToken:", err);
            return next(errorCustom(500, "Internal server error during token verification"));
        }
    }
};
