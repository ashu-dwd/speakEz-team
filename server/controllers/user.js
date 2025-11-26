import User from "../models/user.js";
import Otp from "../models/otp.js";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import emailSender from "./emailSender.js";
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
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      data: token,
      user: user,
      message: "User signed in successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleOtpVerification = async (req, res) => {
  const { email, otp, password, name } = req.body;

  if (!email || !otp || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await Otp.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);

    if (parseInt(user.otp) !== parseInt(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const newUser = await handleUserSignup(email, password, name);

    return res.status(200).json({
      data: newUser,
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

const handleOtpGeneration = async (req, res) => {
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

export {
  handleUserSignup,
  handleUserSignin,
  handleOtpGeneration,
  handleOtpVerification,
};
