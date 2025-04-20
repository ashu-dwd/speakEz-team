import { nanoid } from "nanoid";


const generateChatRoomId = (req, res) => {
    const roomId = nanoid(10);
    return res.status(200).json({ roomId: roomId });
}
const handleUserConvo = (req, res) => {
    const { charId, roomId } = req.params;
    console.log(charId, roomId);


}

export { generateChatRoomId, handleUserConvo };