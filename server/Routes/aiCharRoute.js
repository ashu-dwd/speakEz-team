import express from "express";
import { generateCharacter } from "../controllers/aiChar.js";
import aiChar from "../models/aiChar.js";
import multer from "multer";

const Router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
    }
})

const upload = multer({ storage: storage })

Router.get('/', async (req, res) => {
    try {
        const allCharacters = await aiChar.find().exec();
        return res.status(200).json({ allCharacters });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
Router.post('/', upload.single('aiCharImg'), generateCharacter);



export default Router;
