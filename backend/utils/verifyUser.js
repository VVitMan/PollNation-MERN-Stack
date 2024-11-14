import jwt from 'jsonwebtoken';
import { errorCustom } from './errorCustom.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    // ตรวจสอบ token ทั้งในคุกกี้และใน Headers
    // const token = req.cookies.access_token || req.headers['authorization'];

    if (!token) return next(errorCustom(401, "You are not authenticated"));

    // Verify Token using JWT_SECRET from .env file (Remember to set it in your .env file)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorCustom(403, "Invalid Token"));
        req.user = user; // If successful, attach the decoded user information to the request object
        next();  // Proceed to the next middleware or route handler, ส่ง req.user = user
    });
}
