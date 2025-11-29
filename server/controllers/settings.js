import User from "../models/user.js";
import Otp from "../models/otp.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import emailSender from "./email-sender.js";

/**
 * Request email change with OTP
 */
const requestEmailChange = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ error: "New email is required" });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Store or update OTP for this email
    await Otp.findOneAndUpdate(
      { email: newEmail },
      { email: newEmail, otp },
      { upsert: true, new: true }
    );

    // Send OTP to new email
    await emailSender(
      newEmail,
      "Email Verification - SpeakEZ",
      `Your OTP for email verification is: ${otp}`
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent to new email address",
    });
  } catch (error) {
    console.error("Error requesting email change:", error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

/**
 * Verify OTP and update email
 */
const verifyEmailChange = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { newEmail, otp } = req.body;

    if (!newEmail || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ email: newEmail });
    if (!otpRecord || parseInt(otpRecord.otp) !== parseInt(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check again if email is still available
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Update user email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.email = newEmail;
    await user.save();

    // Delete OTP record
    await Otp.deleteOne({ email: newEmail });

    // Return updated user
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return res.status(200).json({
      success: true,
      user: userResponse,
      message: "Email updated successfully",
    });
  } catch (error) {
    console.error("Error verifying email change:", error);
    return res.status(500).json({ error: "Failed to update email" });
  }
};

/**
 * Update user profile information (excluding email)
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, username, bio, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if username is being changed and if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }
      user.username = username;
    }

    // Update other fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    // Return updated user without sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return res.status(200).json({
      success: true,
      user: userResponse,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

/**
 * Upload user avatar
 */
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete old avatar if exists
    if (user.profilePicture) {
      const oldPath = path.join(process.cwd(), user.profilePicture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new avatar path
    user.profilePicture = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    return res.status(200).json({
      success: true,
      profilePicture: user.profilePicture,
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return res.status(500).json({ error: "Failed to upload avatar" });
  }
};

/**
 * Change user password
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Failed to change password" });
  }
};

/**
 * Delete user avatar
 */
const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete avatar file if exists
    if (user.profilePicture) {
      const filePath = path.join(process.cwd(), user.profilePicture);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      user.profilePicture = null;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Avatar deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return res.status(500).json({ error: "Failed to delete avatar" });
  }
};

export {
  updateProfile,
  uploadAvatar,
  changePassword,
  deleteAvatar,
  requestEmailChange,
  verifyEmailChange,
};
