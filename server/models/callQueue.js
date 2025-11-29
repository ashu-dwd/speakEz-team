import mongoose from "mongoose";

const callQueueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One queue entry per user
    },
    socketId: {
      type: String,
      required: true,
    },
    callType: {
      type: String,
      enum: ["public_speaking"],
      default: "public_speaking",
    },
    status: {
      type: String,
      enum: ["waiting", "matching", "matched"],
      default: "waiting",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      skillLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "intermediate",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queue management
callQueueSchema.index({ callType: 1, status: 1, joinedAt: 1 });
callQueueSchema.index({ userId: 1 }, { unique: true });
callQueueSchema.index({ socketId: 1 });

// TTL index to automatically remove stale queue entries after 5 minutes
callQueueSchema.index({ joinedAt: 1 }, { expireAfterSeconds: 300 });

export default mongoose.model("CallQueue", callQueueSchema);
