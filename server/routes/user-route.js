import express from "express";
import { handleUserSignin, handleOtpGeneration, handleOtpVerification, handleForgotPassword, handleVerifyResetToken, handleResetPassword, handleUserLogout, handleRefreshToken } from "../controllers/user.js";
import verifyToken from "../middlewares/auth.js";

const Router = express.Router();


Router.post('/login', handleUserSignin);
Router.post('/gen-otp', handleOtpGeneration)
Router.post('/verify-otp', handleOtpVerification);
Router.post("/forgot-password", handleForgotPassword);

Router.post("/verify-reset-token", handleVerifyResetToken);
Router.post("/reset-password/:token", handleResetPassword);
Router.post("/logout", verifyToken, handleUserLogout);
Router.post("/refresh-token", handleRefreshToken);

export default Router;