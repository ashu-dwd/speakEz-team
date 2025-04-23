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
        default: 'q6zgrKfJ',
        ref: 'Character',
        required: true
    },
}, {
    timestamps: true
})

export default mongoose.model('Room', roomSchema);
