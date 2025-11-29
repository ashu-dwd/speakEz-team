import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    lastLogin: {
        type: Date,
    },
    loginCount: {
        type: Number,
        default: 0,
    },
    activityLog: [{
        action: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
    refreshToken: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    phone: {
        type: String,
    },
}, {
    timestamps: true,
});

export default mongoose.model('User', userSchema);
