import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true,
    },
    
    // Aggregate metrics
    totalSessions: {
        type: Number,
        default: 0,
    },
    totalTimeSpoken: {
        type: Number, // in seconds
        default: 0,
    },
    averageScore: {
        type: Number,
        default: 0,
    },
    
    // Streak tracking
    currentStreak: {
        type: Number,
        default: 0,
    },
    longestStreak: {
        type: Number,
        default: 0,
    },
    lastPracticeDate: {
        type: Date,
    },
    
    // Session type breakdown
    sessionsByType: {
        interview: { type: Number, default: 0 },
        public_speaking: { type: Number, default: 0 },
        casual_chat: { type: Number, default: 0 },
    },
    
    // Score history (last 30 days)
    scoreHistory: [{
        date: Date,
        averageScore: Number,
    }],
}, {
    timestamps: true,
});

export default mongoose.model('UserStats', userStatsSchema);
