/**
 * Dashboard Page
 * Modern dashboard with stats, recent activity, and practice options.
 */

import { useEffect, useState } from "react";
import { FaMicrophone, FaStar, FaFire, FaClock } from "react-icons/fa";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import StatsCard from "../components/dashboard/StatsCard";
import ActionCard from "../components/dashboard/ActionCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import axiosInstance from "../utils/axios";

/**
 * Retrieves the current logged-in user from storage.
 */
function getCurrentUser() {
  try {
    const localAuth = localStorage.getItem("auth");
    const sessionAuth = sessionStorage.getItem("auth");
    const authContent = localAuth || sessionAuth;
    if (!authContent) return null;
    const { user } = JSON.parse(authContent);
    return user || null;
  } catch (err) {
    return null;
  }
}

const Dashboard = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/stats/dashboard");
      if (res.data && res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Use default stats on error
      setStats({
        totalSessions: 0,
        averageScore: 0,
        currentStreak: 0,
        timeSpoken: "0m",
      });
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-2">You are not logged in</h2>
        <p className="text-base-content/70">
          Please login to view your dashboard.
        </p>
      </div>
    );
  }

  // Stats data from API
  const statsCards = statsLoading
    ? [
        {
          icon: FaMicrophone,
          label: "Total Sessions",
          value: "...",
          color: "primary",
        },
        {
          icon: FaStar,
          label: "Average Score",
          value: "...",
          color: "warning",
        },
        {
          icon: FaFire,
          label: "Current Streak",
          value: "...",
          color: "error",
        },
        {
          icon: FaClock,
          label: "Time Practiced",
          value: "...",
          color: "secondary",
        },
      ]
    : [
        {
          icon: FaMicrophone,
          label: "Total Sessions",
          value: stats?.totalSessions || 0,
          color: "primary",
        },
        {
          icon: FaStar,
          label: "Average Score",
          value: `${stats?.averageScore || 0}%`,
          color: "warning",
        },
        {
          icon: FaFire,
          label: "Current Streak",
          value: `${stats?.currentStreak || 0} days`,
          color: "error",
        },
        {
          icon: FaClock,
          label: "Time Practiced",
          value: stats?.timeSpoken || "0m",
          color: "secondary",
        },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <WelcomeSection 
          userName={user.name || user.username} 
          profilePicture={user.profilePicture ? `${import.meta.env.VITE_APP_API_URL}${user.profilePicture}` : null}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>

        {/* Action Card */}
        <ActionCard />

        {/* Recent Activity */}
        <RecentActivity />

        {/* User Info Card (kept for reference) */}
        <div className="card bg-base-100 shadow-lg border border-base-300/50">
          <div className="card-body p-6">
            <h3 className="text-xl font-bold mb-4 text-base-content">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-base-content/70">Email:</span>
                <p className="text-base-content">{user.email || "—"}</p>
              </div>
              <div>
                <span className="font-semibold text-base-content/70">Username:</span>
                <p className="text-base-content">{user.username || "—"}</p>
              </div>
              <div>
                <span className="font-semibold text-base-content/70">Last Login:</span>
                <p className="text-base-content">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "—"}
                </p>
              </div>
              <div>
                <span className="font-semibold text-base-content/70">Account Created:</span>
                <p className="text-base-content">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
