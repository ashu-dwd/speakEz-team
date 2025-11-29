import UserStats from "../models/userStats.js";
import Session from "../models/session.js";

/**
 * Get dashboard stats for a user
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    let stats = await UserStats.findOne({ userId });

    if (!stats) {
      // Create default stats if none exist
      stats = await UserStats.create({ userId });
    }

    // Format time spoken
    const hours = Math.floor(stats.totalTimeSpoken / 3600);
    const minutes = Math.floor((stats.totalTimeSpoken % 3600) / 60);
    const timeSpokenFormatted = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return res.status(200).json({
      success: true,
      stats: {
        totalSessions: stats.totalSessions,
        averageScore: stats.averageScore,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        timeSpoken: timeSpokenFormatted,
        timeSpokenSeconds: stats.totalTimeSpoken,
        sessionsByType: stats.sessionsByType,
        lastPracticeDate: stats.lastPracticeDate,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
};

/**
 * Get score history for charts
 */
const getScoreHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessions = await Session.find({
      userId,
      isCompleted: true,
      completedAt: { $gte: startDate },
    })
      .sort({ completedAt: 1 })
      .select("score completedAt");

    // Group by date
    const scoresByDate = {};
    sessions.forEach((session) => {
      const date = session.completedAt.toISOString().split("T")[0];
      if (!scoresByDate[date]) {
        scoresByDate[date] = [];
      }
      scoresByDate[date].push(session.score);
    });

    // Calculate daily averages
    const history = Object.keys(scoresByDate).map((date) => ({
      date,
      averageScore: Math.round(
        scoresByDate[date].reduce((a, b) => a + b, 0) / scoresByDate[date].length
      ),
      sessionsCount: scoresByDate[date].length,
    }));

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Error fetching score history:", error);
    return res.status(500).json({ error: "Failed to fetch score history" });
  }
};

export {
  getDashboardStats,
  getScoreHistory,
};
