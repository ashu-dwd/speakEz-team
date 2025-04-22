import express from "express";
import { handleUserSignup, handleUserSignin, handleOtpGeneration, handleOtpVerification } from "../controllers/user.js";

const Router = express.Router();


Router.post('/signup', handleUserSignup);
Router.post('/signin', handleUserSignin);
Router.post('/deleteUser', (req, res) => { });
Router.post('/updateUser', (req, res) => { });
Router.post('/gen-otp', handleOtpGeneration)
Router.post('/verify-otp', handleOtpVerification)

export default Router;