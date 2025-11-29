import { z } from "zod";

// User schemas
export const userSignupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const otpGenerationSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const otpVerificationSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(4, "OTP must be 4 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const verifyResetTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

// Chat schemas
export const generateChatRoomSchema = z.object({
  charId: z.string().min(1, "Character ID is required"),
});

export const userConvoSchema = z.object({
  charId: z.string().min(1, "Character ID is required"),
  roomId: z.string().min(1, "Room ID is required"),
  userMsg: z.string().min(1, "Message is required"),
});

// AI Char schemas
export const generateCharacterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  personality: z.string().min(1, "Personality is required"),
});

// User data schema
export const userDataSchema = z.object({
  // Assuming userId from token, no body validation needed
});