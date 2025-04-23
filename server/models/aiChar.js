import mongoose from "mongoose";

const aiCharSchema = new mongoose.Schema({
    charId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    personality: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true
})

export default mongoose.model('AiChar', aiCharSchema);