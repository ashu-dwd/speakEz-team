import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/user/dashboard")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching dashboard data", err));
  }, []);

  if (!user) return <div className="dashboard-loading" >Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user.name}!</h1>
      <p className="dashboard-email">Email: {user.email}</p>

      <div className="dashboard-section">
        <h2 className="dashboard-subtitiles">Your Courses:</h2>
        {user.courses.length > 0 ? (
          <ul className="dashboard-list">
            {user.courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        ) : (
          <p>You haven't enrolled in any courses yet.</p>
        )}
      </div>

      <div className="dashboard-section">
        <h2 className="dashboard-subtitles">Your Activity Progress:</h2>
        <div className="dashboard-progress-circle"> 
        <p>{user.activityProgress}%</p>
        </div>
      </div>
    </div>
  );
}
