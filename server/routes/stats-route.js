import express from "express";
import {
  getDashboardStats,
  getScoreHistory,
} from "../controllers/stats.js";
import verifyToken from "../middlewares/auth.js";

const Router = express.Router();

// All stats routes require authentication
Router.get("/dashboard", verifyToken, getDashboardStats);
Router.get("/history", verifyToken, getScoreHistory);

export default Router;
