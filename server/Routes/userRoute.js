import express from "express";
import { handleUserSignup, handleUserSignin } from "../controllers/user.js";

const Router = express.Router();


Router.post('/signup', handleUserSignup);
Router.post('/signin', handleUserSignin);
Router.post('/deleteUser', (req, res) => { });
Router.post('/updateUser', (req, res) => { });

export default Router;