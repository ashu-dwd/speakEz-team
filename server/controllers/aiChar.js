import { nanoid } from "nanoid";
import aiChar from "../models/aiChar.js";


const generateCharacter = async (req, res) => {
    const { name, description, personality } = req.body;
    const image = req.file.path;
    if (!name || !description || !personality || !image) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }
    // Here you would typically save the character to a database or perform some other action.
    const charId = nanoid(8);
    try {
        const aiChar = await aiChar.create({
            charId,
            name,
            description,
            personality,
            image,
        });
        return res.status(200).json({
            message: "Character generated successfully",
            character: {
                name,
                description,
                personality,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}


export { generateCharacter }