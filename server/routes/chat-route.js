import express from "express";
import { generateChatRoomId, handleUserConvo } from "../controllers/chat.js";

const Router = express.Router();

Router.post("/", generateChatRoomId);
Router.post("/ai", handleUserConvo);

export default Router;
