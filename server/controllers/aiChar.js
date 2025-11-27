import { nanoid } from "nanoid";
import aiChar from "../models/aiChar.js";

const generateCharacter = async (req, res) => {
    try {
        const { name, description, personality } = req.body;
        const image = req.file?.filename || "image.jpg";

        // Validation
        if (!name || !description || !personality || !image) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const charId = nanoid(8);
        // console.log(req.user)

        const newCharacter = await aiChar.create({
            charId,
            name,
            description,
            personality,
            image,
            createdBy: req.user.userId
        });

        return res.status(201).json({
            message: "Character generated successfully",
            character: {
                charId,
                name,
                description,
                personality,
                image,
            },
        });
    } catch (error) {
        console.error("Character creation error:", error);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

export { generateCharacter };
