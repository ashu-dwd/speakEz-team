import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    userMsg: {
        type: String,
        required: true
    },
    charMsg: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

export default mongoose.model('Chat', chatSchema);