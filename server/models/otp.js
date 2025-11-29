import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
}, {
    timestamps: true
});

// TTL index for expiration (15 minutes)
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });


const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
