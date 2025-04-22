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
Router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log(email);
    if (!email) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found with this email" });
        }
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        emailSender(email, "Password Reset", `Click here to reset your password: ${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`);
        return res.status(200).json({ message: "Password reset link sent successfully", success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default Router;