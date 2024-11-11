/* Importing required modules */
import express from "express";              // Express framework for handling HTTP requests and routing.
import bodyParser from "body-parser";       // Middleware to parse the body of incoming requests (JSON, URL-encoded).
import mongoose from "mongoose";            // ODM (Object Data Modeling) library for MongoDB, used to structure and interact with the database.
import cors from "cors";                    // Middleware to enable Cross-Origin Resource Sharing, allowing access from different domains.
import dotenv from "dotenv";                // Loads environment variables from a .env file into process.env for secure configuration.
import multer from "multer";                // Middleware to handle file uploads in HTTP requests.
import helmet from "helmet";                // Middleware that sets various HTTP headers to secure the app from common web vulnerabilities.
import morgan from "morgan";                // HTTP request logger middleware, useful for logging request details in development.
import path from "path";                    // Node.js utility module for working with file and directory paths.
import { fileURLToPath } from "url";        // Function to convert file URLs into file paths, especially useful with ES modules.
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/questions.js"
import { verifyToken } from "./middleware/auth.js";
import { createQuestion } from "./controllers/questions.js";


/* Configurations */
// Convert file URL to file path (for ES modules)
const __filename = fileURLToPath(import.meta.url); // Converts the current module's URL to a file path.
const __dirname = path.dirname(__filename); // Gets the directory name of the current module file.
// Load environment variables from .env file
dotenv.config(); // Loads environment variables from a .env file into process.env.
// Initialize the Express application
const app = express(); // Creates an Express application instance to handle HTTP requests.
// Middleware to parse JSON data
app.use(express.json()); // Built-in middleware for parsing JSON request bodies.
// Secure app by setting various HTTP headers
app.use(helmet()); // Adds security-related HTTP headers to protect the app from common vulnerabilities.
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Configures cross-origin resource sharing policy for added security.
// HTTP request logger
app.use(morgan("common")); // Logs HTTP requests in a 'common' format for monitoring and debugging.
// Middleware to parse JSON and URL-encoded data with a size limit
app.use(bodyParser.json({ limit: "30mb", extended: true })); // Parses incoming JSON request bodies with a maximum size of 30mb.
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // Parses URL-encoded data with a maximum size of 30mb.
// Enable Cross-Origin Resource Sharing
app.use(cors()); // Allows cross-origin requests, enabling the API to be accessed from different domains.
// Serve static files, local machine
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // Serves static files (like images) from the 'public/assets' directory.

// index.js
/* FILES STORAGE */
const storage = multer.diskStorage({
    // Set the destination for uploaded files
    destination: function (req, file, cb) {
        cb(null, "public/assets"); // Specify the folder where files will be stored (corrected to use '/' instead of ',' in the path).
    },
    // Set the filename for uploaded files
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name as the name for the uploaded file.
    }
});
// Initialize multer with the defined storage settings
const upload = multer({ storage }); // Create an instance of multer with the specified storage configuration.

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/questions", verifyToken, upload.single("picture"), createQuestion);

/* ROTES */
app.use("/auth", authRoutes); // => register, login
app.use("/users", userRoutes);
app.use("/qustions", questionRoutes); // => question

/* MONGOOSE SET UP */
const PORT = process.env.PORT || 6000;
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect`));
