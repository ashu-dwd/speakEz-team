import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import axiosInstance from "../../utils/axios";

/**
 * RecentActivity - Displays recent practice sessions
 */
const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    try {
      const res = await axiosInstance.get("/session/recent?limit=5");
      if (res.data && res.data.success) {
        // Transform API data to match component format
        const formattedActivities = res.data.sessions.map((session) => ({
          id: session._id,
          date: new Date(session.completedAt).toLocaleDateString(),
          topic: session.topic,
          duration: formatDuration(session.duration),
          score: session.score,
        }));
        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error("Error fetching recent sessions:", error);
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
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Duration</th>
                  <th>Score</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover">
                    <td className="text-sm">{activity.date}</td>
                    <td className="font-medium">{activity.topic}</td>
                    <td className="text-sm text-base-content/70">
                      {activity.duration}
                    </td>
                    <td>
                      <span
                        className={`font-bold text-lg ${getScoreColor(
                          activity.score
                        )}`}
                      >
                        {activity.score}%
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-base-content/60 py-8">
            No recent activity. Start your first practice session!
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
