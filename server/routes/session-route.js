import express from "express";
import {
  startSession,
  completeSession,
  getRecentSessions,
  getSessionDetails,
} from "../controllers/session.js";
import verifyToken from "../middlewares/auth.js";

const Router = express.Router();

// All session routes require authentication
Router.post("/start", verifyToken, startSession);
Router.post("/:sessionId/complete", verifyToken, completeSession);
Router.get("/recent", verifyToken, getRecentSessions);
Router.get("/:sessionId", verifyToken, getSessionDetails);

export default Router;
