import mongoose from "mongoose";

const interviewAssessmentSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    categoryScores: {
      communication: { type: Number, min: 0, max: 100, required: true },
      technicalSkills: { type: Number, min: 0, max: 100, required: true },
      problemSolving: { type: Number, min: 0, max: 100, required: true },
      behavioral: { type: Number, min: 0, max: 100, required: true },
      confidence: { type: Number, min: 0, max: 100, required: true },
      clarity: { type: Number, min: 0, max: 100, required: true },
    },
    detailedAnalysis: {
      communicationAnalysis: { type: String, required: true },
      technicalAnalysis: { type: String, required: true },
      problemSolvingAnalysis: { type: String, required: true },
      behavioralAnalysis: { type: String, required: true },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      recommendations: [{ type: String }],
    },
    benchmarks: {
      communicationPercentile: { type: Number, min: 0, max: 100 },
      technicalPercentile: { type: Number, min: 0, max: 100 },
      overallPercentile: { type: Number, min: 0, max: 100 },
    },
    interviewInsights: {
      responseQuality: {
        type: String,
        enum: ["excellent", "good", "average", "needs_improvement"],
        required: true,
      },
      consistency: {
        type: String,
        enum: ["excellent", "good", "average", "needs_improvement"],
        required: true,
      },
      engagement: {
        type: String,
        enum: ["excellent", "good", "average", "needs_improvement"],
        required: true,
      },
      adaptability: {
        type: String,
        enum: ["excellent", "good", "average", "needs_improvement"],
        required: true,
      },
    },
    nextSteps: [
      {
        priority: {
          type: String,
          enum: ["high", "medium", "low"],
          required: true,
        },
        action: { type: String, required: true },
        timeframe: { type: String, required: true },
        resources: [{ type: String }],
      },
    ],
    transcript: [
      {
        timestamp: Date,
        speaker: {
          type: String,
          enum: ["user", "ai"],
          required: true,
        },
        text: { type: String, required: true },
      },
    ],
    preferences: {
      jobType: { type: String, required: true },
      experienceLevel: { type: String, required: true },
      focusAreas: [{ type: String }],
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
interviewAssessmentSchema.index({ sessionId: 1 }, { unique: true });
interviewAssessmentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("InterviewAssessment", interviewAssessmentSchema);
