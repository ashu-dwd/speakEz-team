import { nanoid } from "nanoid";
import handler from "./roleplay.js";
import Room from "../models/room.js";
import aiChar from "../models/aiChar.js";
import Chat from "../models/chat.js";


const generateChatRoomId = async (req, res) => {
    const { charId } = req.body;
    console.log(charId);
    const roomId = nanoid(10);
    await Room.create({
        roomId: roomId,
        userId: '6807346ff80c058e582ebe55',
        charId: charId
    });
    return res.status(200).json({ roomId: roomId, success: true });
}
const handleUserConvo = async (req, res) => {
    const { charId, roomId } = req.params;
    const { userMsg } = req.body;
    console.log(charId, roomId);
    const isRoomExist = await Room.findOne({ roomId });
    if (!isRoomExist) return res.status(400).json({ error: "Room not found" });
    const isCharExist = await aiChar.findOne({ charId });
    if (!isCharExist) return res.status(400).json({ error: "Character not found" });
    const charResponse = await handler(userMsg);
    await Chat.create({ roomId, userMsg, charMsg: charResponse });
    return res.status(200).json({ charResponse: charResponse, success: true });
}

export { generateChatRoomId, handleUserConvo };