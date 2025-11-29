import Session from "../models/session.js";
import UserStats from "../models/userStats.js";

/**
 * Start a new practice session
 */
const startSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionType, topic, aiCharacterId, roomId } = req.body;

    if (!sessionType || !topic) {
      return res.status(400).json({ error: "Session type and topic are required" });
    }

    const session = await Session.create({
      userId,
      sessionType,
      topic,
      aiCharacterId,
      roomId,
      startedAt: new Date(),
      isCompleted: false,
    });

    return res.status(201).json({
      success: true,
      session,
      message: "Session started successfully",
    });
  } catch (error) {
    console.error("Error starting session:", error);
    return res.status(500).json({ error: "Failed to start session" });
  }
};

/**
 * Complete a practice session and update stats
 */
const completeSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;
    const { duration, score, metrics, transcript } = req.body;

    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.isCompleted) {
      return res.status(400).json({ error: "Session already completed" });
    }

    // Update session
    session.duration = duration;
    session.score = score;
    session.metrics = metrics || {};
    session.transcript = transcript || [];
    session.completedAt = new Date();
    session.isCompleted = true;
    await session.save();

    // Update user stats
    await updateUserStats(userId, session);

    return res.status(200).json({
      success: true,
      session,
      message: "Session completed successfully",
    });
  } catch (error) {
    console.error("Error completing session:", error);
    return res.status(500).json({ error: "Failed to complete session" });
  }
};

/**
 * Get recent sessions for activity feed
 */
const getRecentSessions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;

    const sessions = await Session.find({ userId, isCompleted: true })
      .sort({ completedAt: -1 })
      .limit(limit)
      .select("topic duration score sessionType completedAt");

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Error fetching recent sessions:", error);
    return res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

/**
 * Get session details by ID
 */
const getSessionDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;

    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Error fetching session details:", error);
    return res.status(500).json({ error: "Failed to fetch session details" });
  }
};

/**
 * Helper: Update user stats after session completion
 */
const updateUserStats = async (userId, session) => {
  try {
    let stats = await UserStats.findOne({ userId });

    if (!stats) {
      stats = await UserStats.create({ userId });
    }

    // Update aggregate metrics
    stats.totalSessions += 1;
    stats.totalTimeSpoken += session.duration;
    
    // Calculate new average score
    const totalScorePoints = stats.averageScore * (stats.totalSessions - 1) + session.score;
    stats.averageScore = Math.round(totalScorePoints / stats.totalSessions);

    // Update session type breakdown
    stats.sessionsByType[session.sessionType] = (stats.sessionsByType[session.sessionType] || 0) + 1;

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (stats.lastPracticeDate) {
      const lastPractice = new Date(stats.lastPracticeDate);
      lastPractice.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Same day, no change to streak
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        stats.currentStreak += 1;
        if (stats.currentStreak > stats.longestStreak) {
          stats.longestStreak = stats.currentStreak;
        }
      } else {
        // Streak broken, reset to 1
        stats.currentStreak = 1;
      }
    } else {
      // First session
      stats.currentStreak = 1;
      stats.longestStreak = 1;
    }

    stats.lastPracticeDate = new Date();
    await stats.save();
  } catch (error) {
    console.error("Error updating user stats:", error);
  }
};

export {
  startSession,
  completeSession,
  getRecentSessions,
  getSessionDetails,
};
