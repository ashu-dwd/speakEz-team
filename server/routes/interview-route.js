import express from "express";
import { nanoid } from "nanoid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import InterviewSession from "../models/interviewSession.js";
import InterviewPreferences from "../models/interviewPreferences.js";
import InterviewAssessment from "../models/interviewAssessment.js";
import verifyToken from "../middlewares/auth.js";

const router = express.Router();

// Apply authentication to all routes
router.use(verifyToken);

/**
 * Get user's interview preferences
 */
router.get("/preferences", async (req, res) => {
  try {
    const userId = req.user.userId;

    // Use findOneAndUpdate with upsert to atomically create or get preferences
    const preferences = await InterviewPreferences.findOneAndUpdate(
      { userId },
      {}, // No updates, just ensure document exists
      {
        upsert: true,
        new: true, // Return the updated/new document
        setDefaultsOnInsert: true, // Apply default values when inserting
      }
    );

    res.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error("Error fetching interview preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview preferences",
    });
  }
});

/**
 * Update user's interview preferences
 */
router.put("/preferences", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { defaultPreferences, customSettings } = req.body;

    // Build update object
    const updateObj = {};
    if (defaultPreferences) {
      Object.keys(defaultPreferences).forEach((key) => {
        updateObj[`defaultPreferences.${key}`] = defaultPreferences[key];
      });
    }
    if (customSettings) {
      Object.keys(customSettings).forEach((key) => {
        updateObj[`customSettings.${key}`] = customSettings[key];
      });
    }

    // Use findOneAndUpdate with upsert to atomically update or create preferences
    const preferences = await InterviewPreferences.findOneAndUpdate(
      { userId },
      updateObj,
      {
        upsert: true,
        new: true, // Return the updated document
        setDefaultsOnInsert: true, // Apply default values when inserting
      }
    );

    res.json({
      success: true,
      data: preferences,
      message: "Preferences updated successfully",
    });
  } catch (error) {
    console.error("Error updating interview preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update interview preferences",
    });
  }
});

/**
 * Create a new interview session
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({
        success: false,
        message: "Interview preferences are required",
      });
    }

    // Generate unique session ID
    const sessionId = `interview_${nanoid(12)}`;

    const interviewSession = new InterviewSession({
      sessionId,
      userId,
      preferences,
      status: "setup",
    });

    await interviewSession.save();

    res.status(201).json({
      success: true,
      data: interviewSession,
      message: "Interview session created successfully",
    });
  } catch (error) {
    console.error("Error creating interview session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create interview session",
    });
  }
});

/**
 * Get interview session by ID
 */
router.get("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    const session = await InterviewSession.findOne({
      sessionId,
      userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error fetching interview session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview session",
    });
  }
});

/**
 * Start interview session
 */
router.put("/:sessionId/start", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    const session = await InterviewSession.findOne({
      sessionId,
      userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    if (session.status !== "setup") {
      return res.status(400).json({
        success: false,
        message: "Interview session cannot be started",
      });
    }

    session.status = "active";
    session.startedAt = new Date();
    await session.save();

    res.json({
      success: true,
      data: session,
      message: "Interview session started successfully",
    });
  } catch (error) {
    console.error("Error starting interview session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start interview session",
    });
  }
});

/**
 * End interview session
 */
router.put("/:sessionId/end", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;
    const { feedback } = req.body;

    const session = await InterviewSession.findOne({
      sessionId,
      userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    if (session.status === "completed" || session.status === "terminated") {
      return res.status(400).json({
        success: false,
        message: "Interview session is already ended",
      });
    }

    session.status = "completed";
    session.endedAt = new Date();

    if (session.startedAt) {
      session.duration = Math.floor(
        (session.endedAt - session.startedAt) / 1000
      );
    }

    if (feedback) {
      session.feedback = feedback;
    }

    // Calculate overall score based on question scores
    if (session.questions.length > 0) {
      const totalScore = session.questions.reduce(
        (sum, q) => sum + (q.score || 0),
        0
      );
      session.overallScore = Math.round(totalScore / session.questions.length);
    }

    await session.save();

    // Only generate assessment if interview was actually started
    if (session.startedAt && session.status === "completed") {
      try {
        const assessment = await generateInterviewAssessment(session);
        await assessment.save();
        console.log(
          `Created assessment for session ${sessionId}: ${assessment._id}`
        );
      } catch (assessmentError) {
        console.error(
          `Error generating assessment for session ${sessionId}:`,
          assessmentError
        );
      }
    } else {
      console.log(
        `Skipping assessment generation for session ${sessionId} - interview was not started`
      );
    }

    // Create session record for recent activity tracking
    try {
      const Session = (await import("../models/session.js")).default;

      // Calculate score based on interview performance
      const baseScore =
        session.overallScore ||
        Math.min(100, Math.max(50, (session.duration / 60) * 10));

      const sessionRecord = await Session.create({
        userId: session.userId,
        sessionType: "interview",
        topic: `AI Interview Practice - ${session.preferences.jobType}`,
        duration: session.duration,
        score: Math.round(baseScore),
        roomId: session.sessionId,
        startedAt: session.startedAt,
        completedAt: session.endedAt,
        isCompleted: true,
        metrics: {
          fluencyScore: Math.round(baseScore),
          clarityScore: Math.round(baseScore),
          paceScore: Math.round(baseScore),
          confidenceScore: Math.round(baseScore),
          fillerWordsCount: 0, // Not tracked for interviews
        },
        transcript: session.transcript || [],
      });

      console.log(
        `Created interview session record for user ${userId}: ${sessionRecord._id}`
      );
    } catch (sessionError) {
      console.error(
        `Error creating session record for user ${userId}:`,
        sessionError
      );
    }

    // Update user preferences statistics
    const preferences = await InterviewPreferences.findOne({ userId });
    if (preferences) {
      preferences.statistics.totalSessions += 1;
      preferences.statistics.averageScore =
        (preferences.statistics.averageScore *
          (preferences.statistics.totalSessions - 1) +
          (session.overallScore || 0)) /
        preferences.statistics.totalSessions;

      await preferences.save();
    }

    res.json({
      success: true,
      data: session,
      message: "Interview session completed successfully",
    });
  } catch (error) {
    console.error("Error ending interview session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to end interview session",
    });
  }
});

/**
 * Process user speech input and get AI response
 */
router.post("/:sessionId/speech", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;
    const { speechText, questionId } = req.body;

    const session = await InterviewSession.findOne({
      sessionId,
      userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    if (session.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Interview session is not active",
      });
    }

    // Add user speech to transcript
    session.transcript.push({
      timestamp: new Date(),
      speaker: "user",
      text: speechText,
    });

    // Update question response if questionId provided
    if (questionId) {
      const question = session.questions.find(
        (q) => q.questionId === questionId
      );
      if (question) {
        question.userResponse = speechText;
      }
    }

    await session.save();

    // Generate AI response based on speech input
    const aiResponse = await generateAIResponse(session, speechText);

    // Add AI response to transcript
    session.transcript.push({
      timestamp: new Date(),
      speaker: "ai",
      text: aiResponse.text,
      audioUrl: aiResponse.audioUrl,
    });

    await session.save();

    res.json({
      success: true,
      data: {
        response: aiResponse,
        session: session,
      },
    });
  } catch (error) {
    console.error("Error processing speech:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process speech input",
    });
  }
});

/**
 * Get user's interview sessions history
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 10, offset = 0 } = req.query;

    const sessions = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await InterviewSession.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        sessions,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Error fetching interview sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview sessions",
    });
  }
});

/**
 * Get assessment for a specific interview session
 */
router.get("/:sessionId/assessment", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // First verify the session belongs to the user
    const session = await InterviewSession.findOne({
      sessionId,
      userId,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    // Get the assessment
    const assessment = await InterviewAssessment.findOne({
      sessionId: session._id,
      userId,
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found for this session",
      });
    }

    res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    console.error("Error fetching interview assessment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interview assessment",
    });
  }
});

/**
 * Generate comprehensive AI assessment for completed interview
 */
async function generateInterviewAssessment(session) {
  try {
    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare transcript for analysis
    const transcriptText = session.transcript
      .map((entry) => `${entry.speaker.toUpperCase()}: ${entry.text}`)
      .join("\n");

    // Create comprehensive assessment prompt
    const assessmentPrompt = `
You are an expert interview coach analyzing a candidate's interview performance. Based on the following interview transcript, provide a detailed assessment.

INTERVIEW CONTEXT:
- Job Type: ${session.preferences.jobType}
- Experience Level: ${session.preferences.experienceLevel}
- Focus Areas: ${session.preferences.focusAreas?.join(", ") || "General"}
- Interview Duration: ${Math.floor(
      (session.endedAt - session.startedAt) / 1000 / 60
    )} minutes

TRANSCRIPT:
${transcriptText}

Please analyze the candidate's performance and provide a JSON response with the following structure:
{
  "overallScore": number (0-100),
  "categoryScores": {
    "communication": number (0-100),
    "technicalSkills": number (0-100),
    "problemSolving": number (0-100),
    "behavioral": number (0-100),
    "confidence": number (0-100),
    "clarity": number (0-100)
  },
  "detailedAnalysis": {
    "communicationAnalysis": "string - detailed analysis of communication skills",
    "technicalAnalysis": "string - detailed analysis of technical knowledge",
    "problemSolvingAnalysis": "string - detailed analysis of problem-solving approach",
    "behavioralAnalysis": "string - detailed analysis of behavioral responses",
    "strengths": ["array of 3-5 key strengths"],
    "weaknesses": ["array of 2-4 areas for improvement"],
    "recommendations": ["array of 3-5 specific recommendations"]
  },
  "benchmarks": {
    "communicationPercentile": number (0-100),
    "technicalPercentile": number (0-100),
    "overallPercentile": number (0-100)
  },
  "interviewInsights": {
    "responseQuality": "excellent|good|average|needs_improvement",
    "consistency": "excellent|good|average|needs_improvement",
    "engagement": "excellent|good|average|needs_improvement",
    "adaptability": "excellent|good|average|needs_improvement"
  },
  "nextSteps": [
    {
      "priority": "high|medium|low",
      "action": "string - specific actionable step",
      "timeframe": "string - when to implement",
      "resources": ["array of helpful resources"]
    }
  ]
}

Guidelines:
- Be constructive and encouraging while being honest
- Base scores on actual content and quality of responses
- Consider the job type and experience level in your assessment
- Provide specific, actionable feedback
- Focus on both strengths and areas for growth
- Make recommendations practical and achievable
`;

    // Generate assessment using Google AI
    const result = await model.generateContent(assessmentPrompt);
    const response = await result.response;
    const assessmentData = JSON.parse(response.text());

    // Validate and ensure all required fields are present
    const validatedAssessment = {
      sessionId: session._id,
      userId: session.userId,
      overallScore: Math.max(
        0,
        Math.min(100, assessmentData.overallScore || 75)
      ),
      categoryScores: {
        communication: Math.max(
          0,
          Math.min(100, assessmentData.categoryScores?.communication || 75)
        ),
        technicalSkills: Math.max(
          0,
          Math.min(100, assessmentData.categoryScores?.technicalSkills || 75)
        ),
        problemSolving: Math.max(
          0,
          Math.min(100, assessmentData.categoryScores?.problemSolving || 75)
        ),
        behavioral: Math.max(
          0,
          Math.min(100, assessmentData.categoryScores?.behavioral || 75)
        ),
        confidence: Math.max(
          0,
          Math.min(100, assessmentData.categoryScores?.confidence || 75)
        ),
        clarity: Math.max(
          0,
          Math.min(100, assessmentData.categoryScores?.clarity || 75)
        ),
      },
      detailedAnalysis: {
        communicationAnalysis:
          assessmentData.detailedAnalysis?.communicationAnalysis ||
          "Communication analysis not available",
        technicalAnalysis:
          assessmentData.detailedAnalysis?.technicalAnalysis ||
          "Technical analysis not available",
        problemSolvingAnalysis:
          assessmentData.detailedAnalysis?.problemSolvingAnalysis ||
          "Problem-solving analysis not available",
        behavioralAnalysis:
          assessmentData.detailedAnalysis?.behavioralAnalysis ||
          "Behavioral analysis not available",
        strengths: assessmentData.detailedAnalysis?.strengths || [
          "Good participation in interview",
        ],
        weaknesses: assessmentData.detailedAnalysis?.weaknesses || [
          "Continue practicing for more feedback",
        ],
        recommendations: assessmentData.detailedAnalysis?.recommendations || [
          "Keep practicing interviews",
        ],
      },
      benchmarks: {
        communicationPercentile: Math.max(
          0,
          Math.min(
            100,
            assessmentData.benchmarks?.communicationPercentile || 50
          )
        ),
        technicalPercentile: Math.max(
          0,
          Math.min(100, assessmentData.benchmarks?.technicalPercentile || 50)
        ),
        overallPercentile: Math.max(
          0,
          Math.min(100, assessmentData.benchmarks?.overallPercentile || 50)
        ),
      },
      interviewInsights: {
        responseQuality:
          assessmentData.interviewInsights?.responseQuality || "good",
        consistency: assessmentData.interviewInsights?.consistency || "good",
        engagement: assessmentData.interviewInsights?.engagement || "good",
        adaptability: assessmentData.interviewInsights?.adaptability || "good",
      },
      nextSteps: assessmentData.nextSteps || [
        {
          priority: "medium",
          action: "Continue practicing interviews to improve performance",
          timeframe: "Ongoing",
          resources: [
            "Interview preparation platforms",
            "Mock interview partners",
          ],
        },
      ],
      transcript: session.transcript,
      preferences: session.preferences,
      generatedAt: new Date(),
    };

    // Create assessment document
    const assessment = new InterviewAssessment(validatedAssessment);
    return assessment;
  } catch (error) {
    console.error("Error generating AI interview assessment:", error);

    // Fallback to basic assessment if AI fails
    const baseScore = session.overallScore || 75;
    const fallbackAssessment = new InterviewAssessment({
      sessionId: session._id,
      userId: session.userId,
      overallScore: baseScore,
      categoryScores: {
        communication: baseScore,
        technicalSkills: baseScore,
        problemSolving: baseScore,
        behavioral: baseScore,
        confidence: baseScore,
        clarity: baseScore,
      },
      detailedAnalysis: {
        communicationAnalysis:
          "Analysis temporarily unavailable - please try again later.",
        technicalAnalysis:
          "Analysis temporarily unavailable - please try again later.",
        problemSolvingAnalysis:
          "Analysis temporarily unavailable - please try again later.",
        behavioralAnalysis:
          "Analysis temporarily unavailable - please try again later.",
        strengths: ["Active participation in interview"],
        weaknesses: ["Analysis temporarily unavailable"],
        recommendations: ["Continue practicing interviews"],
      },
      benchmarks: {
        communicationPercentile: 50,
        technicalPercentile: 50,
        overallPercentile: 50,
      },
      interviewInsights: {
        responseQuality: "good",
        consistency: "good",
        engagement: "good",
        adaptability: "good",
      },
      nextSteps: [
        {
          priority: "medium",
          action: "Continue practicing interviews",
          timeframe: "Ongoing",
          resources: ["Interview practice platforms"],
        },
      ],
      transcript: session.transcript,
      preferences: session.preferences,
      generatedAt: new Date(),
    });

    return fallbackAssessment;
  }
}

/**
 * Generate AI response for interview
 * This is a placeholder - will integrate with Google AI
 */
async function generateAIResponse(session, userInput) {
  // Placeholder AI response logic
  // In real implementation, this would use Google Generative AI

  const responses = {
    greeting:
      "Hello! I'm excited to conduct your interview today. Let's begin with an introduction. Can you tell me about yourself and your background?",
    followUp:
      "Thank you for sharing that. Can you elaborate on your experience with this particular skill?",
    technical:
      "That's interesting. Let me ask you a technical question. How would you approach solving this problem?",
    behavioral:
      "I appreciate your answer. Now, let me ask about a behavioral situation. Can you describe a time when you faced a challenging situation at work?",
    closing:
      "Thank you for participating in this interview. You've done well. Would you like to discuss any specific areas you'd like feedback on?",
  };

  // Simple logic to determine response type
  let responseType = "followUp";
  if (session.questions.length === 0) {
    responseType = "greeting";
  } else if (session.currentQuestion < 3) {
    responseType = "technical";
  } else if (session.currentQuestion < 6) {
    responseType = "behavioral";
  } else {
    responseType = "closing";
  }

  return {
    text: responses[responseType],
    audioUrl: null, // Will be generated by TTS service
    questionId: `q_${session.currentQuestion + 1}`,
    feedback: "Your response was clear and well-structured.",
  };
}

export default router;
