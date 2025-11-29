import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    charId: {
        type: String,
        ref: 'Character',
        required: true
    },
    lastActivity: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    messageCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
})

export default mongoose.model('Room', roomSchema);
