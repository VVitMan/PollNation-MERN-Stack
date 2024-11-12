import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorCustom } from "../utils/errorCustom.js";

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // hashpassword before store in mongodb
        const hashedPassword = bcryptjs.hashSync(password, 12);
        const newUser = new User({username, email, password: hashedPassword});
        await newUser.save();
        res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        /* do not need to write error multiple times */
        next(error);

        /* Custom Error */
        // next(errorCustom(300, "test error"));
        
        /* Write own */
        // res.status(500).json({ message: "User Already Exists" });
    }
    
};