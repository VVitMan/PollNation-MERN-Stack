import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // hashpassword before store in mongodb
        const hashedPassword = bcryptjs.hashSync(password, 12);
        const newUser = new User({username, email, password: hashedPassword});
        await newUser.save();
        res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        res.status(500).json({ message: "User Already Exists" });
    }
    
};