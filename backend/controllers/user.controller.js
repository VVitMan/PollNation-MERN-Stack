import { errorCustom } from "../utils/errorCustom.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.json({
        message: "user vit from controller"
    });
};

/* Update User */
export const updateUser = async (req, res, next) => {
    /* ตอนเราสร้าง access_token เราใช้ payload เป็น { id: user._id } คือ id ของ user*/
    if (req.user.id !== req.params.id) {
        return next(errorCustom(401, "You can update only your account"));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 12);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,                
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                }
            }, { new: true }
        );
        /* remove password before sent to client side */
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
};

