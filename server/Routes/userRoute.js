import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import { handleUserSignup, handleUserSignin, handleOtpGeneration, handleOtpVerification } from "../controllers/user.js";
import emailSender from "../controllers/emailSender.js";
import PassReset from "../models/passReset.js";

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
        const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${token}`;
        const passResetData = await PassReset.create({ email, token, resetLink, emailSent: true });
        await emailSender(email, "Password Reset", `Click here to reset: ${resetLink}`);

        res.status(200).json({ message: "Reset link sent successfully", success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.post("/verify-reset-token", async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });

    try {
        const tokenData = await PassReset.findOne({
            token
        });
        console.log(tokenData);

        if (!tokenData) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        return res.status(200).json({ message: "Token is valid", success: true });
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});
Router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user = await User.findOne({
            _id: decoded.userId
        });
        console.log(user);

        if (!user) return res.status(400).json({ error: "Invalid or expired token" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ message: "Password reset successful", success: true });
    } catch (err) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }
});

export default Router;