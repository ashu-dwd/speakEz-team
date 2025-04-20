import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { configDotenv } from "dotenv";
import jwt from 'jsonwebtoken';
configDotenv();

const handleUserSignup = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }
    if (email.includes('@') === false) {
        return res.status(400).json({ error: "Please enter a valid email" });
    }

    const username = email.split('@')[0];
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword, username, name });
        return res.status(201).json({
            data: newUser,
            message: "User created successfully"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


const handleUserSignin = async (req, res) => {
    const { email, password } = req.body;
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
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({
            data: token,
            message: "User signed in successfully"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export { handleUserSignup, handleUserSignin };