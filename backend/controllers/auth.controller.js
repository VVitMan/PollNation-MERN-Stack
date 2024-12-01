import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorCustom } from "../utils/errorCustom.js";
import jwt from "jsonwebtoken";

/* Sign Up */
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password) {
      return next(errorCustom(400, "All fields are required"));
    }

    // Validate username: alphanumeric, 3-20 characters
    const isValidUsername = /^[a-zA-Z0-9_]{3,20}$/.test(username);
    if (!isValidUsername) {
      return next(errorCustom(400, "Username must be 3-15 characters long and can only contain letters, numbers, underscores and hyphens."));
    }

    // Validate email: standard email regex
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return next(errorCustom(400, "Please enter a valid email address."));
    }

    // Validate password: minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
    const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    if (!isValidPassword) {
      return next(errorCustom(400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."));
    }

    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return next(errorCustom(409, "Username has been using" ));
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorCustom(409, "Email is already registered"));
    }

    // Hash password before storing in MongoDB
    const hashedSignupPassword = bcryptjs.hashSync(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashedSignupPassword,
    });

    // Save new user to the database
    await newUser.save();

    // Create Token with user details (excluding password)
    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // Remove password from response
    const { password: hashedPassword, ...rest } = newUser._doc;

    // Set Token in Cookie with expiration
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire in 24 hours
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict' // Helps mitigate CSRF attacks
      })
      .status(201)
      .json(rest);
  } catch (error) {
    next(error); // Pass unexpected errors to the error handler
  }
};

/* Sign In */
/* Sign In */
export const signin = async (req, res, next) => {
  try {
    /* Check Email */
    const { email, password } = req.body;

    // Check if required fields are provided
    if (!email || !password) {
      return next(errorCustom(400, "Email and password are required"));
    }

    // Validate email format
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return next(errorCustom(400, "Please enter a valid email address."));
    }

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorCustom(404, "User not found"));
    }

    // Check if the user is banned => consider
    if (user.isBanned) {
      return next(errorCustom(403, "You are banned from logging in."));
    }

    // Check if the password is correct
    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return next(errorCustom(401, "Invalid credentials"));
    }

    /* Create Token */
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    /* Remove Password from Response */
    const { password: hashedPassword, ...rest } = user._doc;

    /* Set Token in Cookie */
    const expiresDate = new Date(Date.now() + 1 * 60 * 60 * 1000); // Expire in 1 hour
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiresDate,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict' // Helps mitigate CSRF attacks
      })
      .status(200)
      .json(rest);

  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      /* Create Token with isAdmin */
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin, // Add this line
        },
        process.env.JWT_SECRET
      );
      const { password: hashedPassword, ...rest } = user._doc;
      const expiresDate = new Date(Date.now() + 1 * 60 * 60 * 1000); // expires 1 hour
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiresDate })
        .status(200)
        .json(rest);
    } else {
      /* Create password for google */
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 12);

      /* Generate Username */
      const name = req.body.name.split(" ").join("").toLowerCase();
      const randomNumber = Math.random().toString(36).slice(-8);
      const username = name + randomNumber;

      /* Save New User */
      const newUser = new User({
        username: username,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });

      await newUser.save();
      // Create Token with isAdmin
      const token = jwt.sign(
        {
          id: newUser._id,
          isAdmin: newUser.isAdmin, // Add this line
        },
        process.env.JWT_SECRET
      );
      const { password: hashedPassword_newUser, ...rest } = newUser._doc;
      const expiresDate = new Date(Date.now() + 1 * 60 * 60 * 1000);

      /* Store in cookie */
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiresDate })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json("User Logged Out Successfully");
};

/* Delete User */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear authentication cookie if required
    res.clearCookie("access_token")

    // Respond with success
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error); // Pass error to the error handler
  }
};
