import React, { useEffect, useState } from "react";
import { FaEye, FaComments, FaMicrophone } from "react-icons/fa";
import axiosInstance from "../../utils/axios";

/**
 * RecentActivity - Displays recent practice sessions and chat room activities
 */
const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      // Fetch both practice sessions and chat room activities
      const [sessionsRes, chatRoomsRes] = await Promise.all([
        axiosInstance.get("/session/recent?limit=3"),
        axiosInstance.get("/chat-rooms/rooms?limit=3"),
      ]);

      const formattedActivities = [];

      // Add practice sessions
      if (sessionsRes.data && sessionsRes.data.success) {
        const sessions = sessionsRes.data.sessions.map((session) => ({
          id: `session-${session._id}`,
          type: "practice",
          date: new Date(session.completedAt).toLocaleDateString(),
          title: session.topic,
          duration: formatDuration(session.duration),
          score: session.score,
          icon: FaMicrophone,
          color: "text-blue-500",
        }));
        formattedActivities.push(...sessions);
      }

      // Add chat room activities (recently joined/created rooms)
      if (chatRoomsRes.data && chatRoomsRes.data.success) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const chatActivities = chatRoomsRes.data.rooms
          .filter((room) => room.participants?.some((p) => p._id === user.id))
          .slice(0, 3)
          .map((room) => ({
            id: `chat-${room.id}`,
            type: "chat",
            date: new Date(room.createdAt).toLocaleDateString(),
            title: room.name,
            description: room.description || "Joined chat room",
            participants: room.participantCount,
            icon: FaComments,
            color: "text-green-500",
          }));
        formattedActivities.push(...chatActivities);
      }

      // Sort by date (most recent first) and limit to 4
      formattedActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivities(formattedActivities.slice(0, 4));
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300/50">
      <div className="card-body p-6">
        <h3 className="text-xl font-bold mb-4 text-base-content">
          Recent Activity
        </h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 bg-base-200/50 rounded-lg hover:bg-base-200/70 transition-colors"
                >
                  <div
                    className={`p-2 rounded-full bg-base-100 ${activity.color}`}
                  >
                    <IconComponent className="text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-base-content truncate">
                        {activity.title}
                      </h4>
                      <span className="text-xs text-base-content/60 bg-base-300 px-2 py-1 rounded">
                        {activity.type === "practice" ? "Practice" : "Chat"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-base-content/70">
                      <span>{activity.date}</span>
                      {activity.type === "practice" ? (
                        <>
                          <span>{activity.duration}</span>
                          <span
                            className={`font-bold ${getScoreColor(
                              activity.score
                            )}`}
                          >
                            {activity.score}%
                          </span>
                        </>
                      ) : (
                        <span>{activity.participants} participants</span>
                      )}
                    </div>
                    {activity.description && (
                      <p className="text-sm text-base-content/60 mt-1 truncate">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <button className="btn btn-ghost btn-sm">
                    <FaEye />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-base-content/60 py-8">
            No recent activity. Start your first practice session or join a chat
            room!
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
