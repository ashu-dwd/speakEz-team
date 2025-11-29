import express from "express";
import User from "../models/user.js";

const Router = express.Router();

Router.get("/", async (req, res) => {
    const userId = req.user.userId;
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Exclude password from response
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(200).json({ user: userResponse, success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})



export default Router;