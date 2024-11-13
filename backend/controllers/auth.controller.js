import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorCustom } from "../utils/errorCustom.js";
import jwt from "jsonwebtoken";

/* Sign Up */
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

/* Sign In */
export const signin = async (req, res, next) => {
    try {
        /* Check Email */
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(errorCustom(404, "user not found"));

        /* Check Password */
        const isMatch = bcryptjs.compareSync(password, user.password);
        if (!isMatch) return next(errorCustom(401, "Invalid Credentials"));

        /* Create Token */
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        /* Remove Password from Response */
        const { password: hashedPassword, ...rest } = user._doc;

        /* Set Token in Cookie */
        // sent back "user" information to use in frontend header when logged in
        /* Expire Cookie 1 hours */
        const expiresDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
        res
            .cookie('access_token', token, { httpOnly: true, expires: expiresDate})
            .status(200)
            .json(rest);

        // res.json({ message: "User Logged In Successfully" });
    } catch (error) {
        next(error);
    }
}