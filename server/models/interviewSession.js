import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    preferences: {
      jobType: {
        type: String,
        required: true,
        enum: [
          "software_engineer",
          "data_scientist",
          "product_manager",
          "designer",
          "marketing",
          "sales",
          "other",
        ],
      },
      experienceLevel: {
        type: String,
        required: true,
        enum: ["entry", "mid", "senior", "executive"],
      },
      difficulty: {
        type: String,
        required: true,
        enum: ["beginner", "intermediate", "advanced"],
      },
      focusAreas: [
        {
          type: String,
          enum: [
            "technical_skills",
            "behavioral",
            "problem_solving",
            "communication",
            "leadership",
          ],
        },
      ],
      duration: {
        type: Number, // in minutes
        default: 30,
        min: 15,
        max: 60,
      },
    },
    status: {
      type: String,
      enum: ["setup", "active", "paused", "completed", "terminated"],
      default: "setup",
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    duration: {
      type: Number, // actual duration in seconds
    },
    currentQuestion: {
      type: Number,
      default: 0,
    },
    questions: [
      {
        questionId: String,
        question: String,
        category: {
          type: String,
          enum: [
            "technical",
            "behavioral",
            "situational",
            "introduction",
            "follow_up",
            "closing",
          ],
        },
        askedAt: Date,
        userResponse: String,
        aiFeedback: String,
        score: Number, // 1-10
      },
    ],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    feedback: {
      strengths: [String],
      improvements: [String],
      overallAssessment: String,
    },
    transcript: [
      {
        timestamp: Date,
        speaker: {
          type: String,
          enum: ["user", "ai"],
        },
        text: String,
        audioUrl: String, // for AI responses
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
interviewSessionSchema.index({ sessionId: 1 });
interviewSessionSchema.index({ userId: 1, createdAt: -1 });
interviewSessionSchema.index({ status: 1 });

export default mongoose.model("InterviewSession", interviewSessionSchema);
