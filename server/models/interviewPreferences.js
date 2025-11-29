import mongoose from "mongoose";

const interviewPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    defaultPreferences: {
      jobType: {
        type: String,
        default: "software_engineer",
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
        default: "entry",
        enum: ["entry", "mid", "senior", "executive"],
      },
      difficulty: {
        type: String,
        default: "intermediate",
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
          default: ["technical_skills", "behavioral"],
        },
      ],
      duration: {
        type: Number, // in minutes
        default: 30,
        min: 15,
        max: 60,
      },
    },
    customSettings: {
      voice: {
        type: String,
        default: "neutral",
        enum: ["male", "female", "neutral"],
      },
      pace: {
        type: String,
        default: "moderate",
        enum: ["slow", "moderate", "fast"],
      },
      feedbackStyle: {
        type: String,
        default: "balanced",
        enum: ["encouraging", "balanced", "direct"],
      },
    },
    statistics: {
      totalSessions: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      favoriteJobType: {
        type: String,
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
      improvementAreas: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user lookups
interviewPreferencesSchema.index({ userId: 1 });

export default mongoose.model(
  "InterviewPreferences",
  interviewPreferencesSchema
);
