import User from "../models/user.js";
import Otp from "../models/otp.js";
import PassReset from "../models/passReset.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import emailSender from "./email-sender.js";
import { configDotenv } from "dotenv";
import {
  userLoginSchema,
  otpGenerationSchema,
  otpVerificationSchema,
  forgotPasswordSchema,
  verifyResetTokenSchema,
  resetPasswordSchema,
} from "../validations.js";
configDotenv();



const handleUserSignup = async (email, password, name) => {
  if (!email || !password || !name) {
    throw new Error("Please fill all the fields");
  }

  if (!email.includes("@")) {
    throw new Error("Please enter a valid email");
  }

  const username = email.split("@")[0];

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    password: hashedPassword,
    username,
    name,
  });

  return newUser;
};

const handleUserSignin = async (req, res) => {
  try {
    const { email, password } = userLoginSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log(user);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Update user tracking
    user.lastLogin = new Date();
    user.loginCount += 1;
    user.activityLog.push({ action: 'login' });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Exclude password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      data: token,
      user: userResponse,
      message: "User signed in successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleOtpVerification = async (req, res) => {
  try {
    const { email, otp, password, name } = otpVerificationSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
  const { email, otp, password, name } = req.body;

  try {
    const user = await Otp.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log(user);

    if (parseInt(user.otp) !== parseInt(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const newUser = await handleUserSignup(email, password, name);

    // Exclude password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(200).json({
      data: userResponse,
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

const handleOtpGeneration = async (req, res) => {
  try {
    const { email } = otpGenerationSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
  const { email } = req.body;
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    const isEmailExistsInOtp = await Otp.findOne({ email });
    //update old otp field with new otp, dont create new one
    if (isEmailExistsInOtp) {
      await Otp.updateOne({ email }, { $set: { otp } });
      return res
        .status(200)
        .json({ message: "OTP sent successfully", success: true });
    }
    const result = await Otp.create({ email, otp });
    const sendingMail = await emailSender(
      email,
      "OTP Verification",
      `Your OTP is ${otp}`
    );
    return res
      .status(200)
      .json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleForgotPassword = async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
  const { email } = req.body;

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
};

const handleVerifyResetToken = async (req, res) => {
  try {
    const { token } = verifyResetTokenSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
  const { token } = req.body;

  try {
    const tokenData = await PassReset.findOne({
      token
    });

    if (!tokenData) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    return res.status(200).json({ message: "Token is valid", success: true });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const handleResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = resetPasswordSchema.parse({ token, newPassword: req.body.newPassword });
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.userId
    });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password reset successful", success: true });
  } catch (err) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
};

export {
  handleUserSignup,
  handleUserSignin,
  handleOtpGeneration,
  handleOtpVerification,
  handleForgotPassword,
  handleVerifyResetToken,
  handleResetPassword,
};
