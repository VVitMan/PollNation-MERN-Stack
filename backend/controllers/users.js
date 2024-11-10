// Import the User model from the User.js file
import User from "../models/User.js";

/* READ */

// Define an asynchronous function to get user data
export const getUser = async (req, res) => {
    try {
        // Destructure the 'id' parameter from the request URL (e.g., /user/:id)
        const { id } = req.params;

        // Use the User model to find a user by their unique ID
        const user = await User.findById(id);

        // If the user is found, respond with a 200 status code and the user data in JSON format
        res.status(200).json(user);
    } catch (err) {
        // If an error occurs, respond with a 404 status code and an error message
        res.status(404).json({ message: err.message });
    }
}

/* export const getUserFriends = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
    
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, username, picturePath }) => {
                return { _id, firstName, lastName, username, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }

} */

/* UPDATE */
/* export const addRemoveFriends = async(req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friend.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, username, picturePath }) => {
                return { _id, firstName, lastName, username, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
} */