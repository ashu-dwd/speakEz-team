import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    sessionType: {
        type: String,
        enum: ['interview', 'public_speaking', 'casual_chat'],
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    duration: {
        type: Number, // in seconds
        default: 0,
    },
    score: {
        type: Number, // 0-100
        min: 0,
        max: 100,
    },
    aiCharacterId: {
        type: String,
    },
    roomId: {
        type: String,
    },
    
    // Detailed metrics
    metrics: {
        fluencyScore: { type: Number, min: 0, max: 100 },
        clarityScore: { type: Number, min: 0, max: 100 },
        paceScore: { type: Number, min: 0, max: 100 },
        confidenceScore: { type: Number, min: 0, max: 100 },
        fillerWordsCount: { type: Number, default: 0 },
    },
    
    // Transcript data
    transcript: [{
        speaker: {
            type: String,
            enum: ['user', 'ai'],
        },
        text: String,
        timestamp: Number,
    }],
    
    // Metadata
    startedAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: {
        type: Date,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Index for efficient queries
sessionSchema.index({ userId: 1, createdAt: -1 });
sessionSchema.index({ userId: 1, isCompleted: 1 });

export default mongoose.model('Session', sessionSchema);
