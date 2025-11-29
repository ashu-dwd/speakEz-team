import mongoose from "mongoose";

const callRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        socketId: {
          type: String,
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["waiting", "connecting", "active", "ended"],
      default: "waiting",
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    duration: {
      type: Number, // in seconds
    },
    callType: {
      type: String,
      enum: ["public_speaking"],
      default: "public_speaking",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient room lookups
callRoomSchema.index({ roomId: 1 });
callRoomSchema.index({ "participants.userId": 1 });
callRoomSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("CallRoom", callRoomSchema);
