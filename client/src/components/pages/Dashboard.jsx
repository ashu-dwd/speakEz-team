// Dashboard.jsx
import React from 'react';
import { auth } from '../../Firebase';
import './Dashboard.css';

const Dashboard = () => {
  const user = auth.currentUser;

  const courses = [
    { title: 'Introduction to English', completed: true },
    { title: 'Grammar Basics', completed: true },
    { title: 'Speaking Practice', completed: false },
    { title: 'Listening Skills', completed: false }
  ];

  const progressPercent = (courses.filter(c => c.completed).length / courses.length) * 100;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome, {user?.displayName || 'User'}! 👋</h1>
        <p className="user-email">Email: {user?.email}</p>

        <div className="dashboard-section">
          <h2>📊 Progress Report</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p>{Math.round(progressPercent)}% Completed</p>
        </div>

        <div className="dashboard-section">
          <h2>📚 Enrolled Courses</h2>
          <ul className="course-list">
            {courses.map((course, index) => (
              <li key={index}>
                {course.completed ? '✅' : '🕒'} {course.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;