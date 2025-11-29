/**
 * Dashboard Page
 * Displays the logged-in user's details. Reads 'auth' from storage.
 * Accessible only after login.
 */

import { useEffect, useState } from "react";

/**
 * Retrieves the current logged-in user from storage.
 * Checks both localStorage and sessionStorage for 'auth' object.
 * Returns user object (with fallback for missing data).
 */
function getCurrentUser() {
  try {
    // Try persistent first, then session
    const localAuth = localStorage.getItem("auth");
    const sessionAuth = sessionStorage.getItem("auth");
    const authContent = localAuth || sessionAuth;
    if (!authContent) return null;
    const { user } = JSON.parse(authContent);
    return user || null;
  } catch (err) {
    return null; // Corrupt/missing data
  }
}

const Dashboard = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, grab user data
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-6">
      <div className="card bg-base-100 shadow-2xl max-w-md w-full p-7 border border-base-200/50">
        <h2 className="text-3xl font-bold mb-5 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Dashboard
        </h2>
        <div className="space-y-2 text-base-content">
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {user.name || user.username || "—"}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email || "—"}
          </div>
          {user.username && (
            <div>
              <span className="font-semibold">Username:</span> {user.username}
            </div>
          )}
          {user.lastLogin && (
            <div>
              <span className="font-semibold">Last Login:</span>{" "}
              {new Date(user.lastLogin).toLocaleString()}
            </div>
          )}
          <div>
            <span className="font-semibold">Account Created:</span>{" "}
            {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
          </div>
          <div>
            <span className="font-semibold">Login Count:</span>{" "}
            {user.loginCount || 1}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
