import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [courses, setCourses] = useState([]);

  const [aiName, setAiName] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [aiImage, setAiImage] = useState("");
  const [aiPersonality, setAiPersonality] = useState("");

  useEffect(() => {
    const fetchUserAndAI = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/user");
        setUserName(userRes.data.name);
        setUserEmail(userRes.data.email);

        const aiRes = await axios.get("http://localhost:5000/api/ai");
        const aiData = aiRes.data;
        setAiName(aiData.name);
        setAiDescription(aiData.description);
        setAiImage(aiData.image);
        setAiPersonality(aiData.personality);
      } catch (error) {
        console.error("Error fetching user or AI data:", error);
      }
    };

    fetchUserAndAI();

    const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    setCourses(enrolled);
  }, []);

  return (
    <div className='user-info'>
      <h1>Welcome</h1>
      <h2>Name: {userName}</h2>
      <h2>Email: {userEmail}</h2>

      {courses.length > 0 && (
        <div className='course'>
          <h1>Your Courses</h1>
          {courses.map((course) => (
            <div key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <h1>AI Character</h1>
        <h2>Name: {aiName}</h2>
        <h2>Description: {aiDescription}</h2>
        <h2>Image: {aiImage}</h2>
        <h2>Personality: {aiPersonality}</h2>
      </div>
    </div>
  );
};

export default Dashboard;

