import express from "express";
import { generateChatRoomId, handleUserConvo } from "../controllers/chat.js";

const Router = express.Router();

Router.get('/', generateChatRoomId);
Router.post('/:charId/:roomId', handleUserConvo)


export default Router;