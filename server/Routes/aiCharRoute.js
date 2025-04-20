import express from "express";
import { generateCharacter } from "../controllers/aiChar.js";
import multer from "multer";

const Router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

Router.get('/', (req, res) => {
    res.send('AI Character Route');
});
Router.post('/', upload.single('aiCharImg'), generateCharacter);



export default Router;