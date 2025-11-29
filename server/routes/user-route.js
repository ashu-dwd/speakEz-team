import express from "express";
import { handleUserSignin, handleOtpGeneration, handleOtpVerification, handleForgotPassword, handleVerifyResetToken, handleResetPassword } from "../controllers/user.js";

const Router = express.Router();


Router.post('/login', handleUserSignin);
Router.post('/gen-otp', handleOtpGeneration)
Router.post('/verify-otp', handleOtpVerification);
Router.post("/forgot-password", handleForgotPassword);

Router.post("/verify-reset-token", handleVerifyResetToken);
Router.post("/reset-password/:token", handleResetPassword);

export default Router;