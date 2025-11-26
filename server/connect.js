import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    return; // Skip connection in test environment (handled by setup.js)
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
