import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { handleUserSignup, handleUserSignin, handleOtpGeneration, handleOtpVerification } from "../controllers/user.js";
import emailSender from "../controllers/emailSender.js";

const Router = express.Router();


Router.post('/signup', handleUserSignup);
Router.post('/login', handleUserSignin);
Router.post('/deleteUser', (req, res) => { });
Router.post('/updateUser', (req, res) => { });
Router.post('/gen-otp', handleOtpGeneration)
Router.post('/verify-otp', handleOtpVerification);
Router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" } // short expiry
        );

        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${token}`;
        await emailSender(email, "Password Reset", `Click here to reset: ${resetLink}`);

        res.status(200).json({ message: "Reset link sent successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
Router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded.userId,
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ error: "Invalid or expired token" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        res.status(400).json({ error: "Invalid or expired token" });
    }
});

export default Router;