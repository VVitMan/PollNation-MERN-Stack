import bcrypt from "bcrypt";                // Import bcrypt library for hashing and comparing passwords.
import jwt from "jsonwebtoken";             // Import jsonwebtoken library for creating and verifying JSON Web Tokens.
import User from "../models/User.js";       // Import the User model to interact with the user data in the database.

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        // Destructure user details from the request body
        const { firstName, lastName, username, email, password, picturePath } = req.body;

        // Generate a salt for hashing the password
        const salt = await bcrypt.genSalt();

        // Hash the password using bcrypt with the generated salt
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a new user object with the hashed password and other user details
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: passwordHash, // Store the hashed password
            picturePath
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Send a success response with the saved user object in JSON format
        res.status(201).json(savedUser);
    } catch (err) {
        // Send an error response if something goes wrong
        res.status(500).json({ error: err.message });
    }
}

/* LOGIN USER */
export const login = async (req, res) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Find a user in the database with the provided email
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist" }); // Send error if no user is found

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" }); // Send error if password is incorrect

        // Generate a JSON Web Token (JWT) for the authenticated user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Use secret key from environment variables

        // Remove the password field from the user object before sending it in the response
        delete user.password;

        // Send a success response with the token and user data
        res.status(200).json({ token, user });
    } catch (err) {
        // Send an error response if something goes wrong
        res.status(500).json({ error: err.message });
    }
}
