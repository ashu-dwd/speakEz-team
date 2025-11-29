import express from "express";
import {
  updateProfile,
  uploadAvatar,
  changePassword,
  deleteAvatar,
  requestEmailChange,
  verifyEmailChange,
} from "../controllers/settings.js";
import verifyToken from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const Router = express.Router();

// All settings routes require authentication
Router.put("/profile", verifyToken, updateProfile);
Router.post("/avatar", verifyToken, upload.single("avatar"), uploadAvatar);
Router.delete("/avatar", verifyToken, deleteAvatar);
Router.put("/password", verifyToken, changePassword);
Router.post("/email/request-change", verifyToken, requestEmailChange);
Router.post("/email/verify-change", verifyToken, verifyEmailChange);

export default Router;
