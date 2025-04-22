import mongoose from "mongoose";

const passResetSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    resetLink: { type: String, required: true },
    emailSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 900 }
});

const PassReset = mongoose.model('PassReset', passResetSchema);
export default PassReset;