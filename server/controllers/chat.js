import { nanoid } from "nanoid";
import handler from "./roleplay.js";
import Room from "../models/room.js";
import aiChar from "../models/aiChar.js";
import Chat from "../models/chat.js";
import { generateChatRoomSchema, userConvoSchema } from "../validations.js";

const generateChatRoomId = async (req, res) => {
  try {
    const { charId } = generateChatRoomSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
  const { charId } = req.body;
  const roomId = nanoid(10);
  await Room.create({
    roomId: roomId,
    charId: charId,
    userId: req.user ? req.user.userId : "680741a975fa6ff05775336a",
  });
  return res.status(200).json({ roomId: roomId, success: true });
};
const handleUserConvo = async (req, res) => {
  try {
    const { charId, roomId, userMsg } = userConvoSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
  const { charId, roomId } = req.body;
  const { userMsg } = req.body;
  const isCharExist = await aiChar.findOne({ charId });
  if (!isCharExist)
    return res.status(400).json({ error: "Character not found" });
  const charResponse = await handler(userMsg, charId);
  await Chat.create({ roomId, userMsg, charMsg: charResponse });

  // Update room tracking
  await Room.findOneAndUpdate(
    { roomId },
    {
      $inc: { messageCount: 1 },
      $set: { lastActivity: new Date() },
    }
  );

  return res.status(200).json({ charResponse, success: true });
};

export { generateChatRoomId, handleUserConvo };
