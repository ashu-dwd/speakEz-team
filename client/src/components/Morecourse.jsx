import React from "react";
import { useState, useEffect } from "react";
import "../assets/Morecourse.css";
import { Link, useNavigate } from "react-router-dom";
import advancedSpeaking from "../assets/AdvancedSpeakingEnglish.png";
import businessCommunication from "../assets/BusinessCommunication.png";
import conversationalPractice from "../assets/ConversationalPractice.png";
import emailWriting from "../assets/EmailWritingSkills.png";
import englishForTravel from "../assets/EnglishforTravel.png";
import grammarEssentials from "../assets/GrammarEssentials.png";
import ieltsPreparation from "../assets/IELTSPreparation.png";
import pronunciationMastery from "../assets/PronunciationMastery.png";
import publicSpeaking from "../assets/PublicSpeaking.png";
import spokenEnglishBasic from "../assets/SpokenEnglishBasic.png";

const allCourses = [
  {
    id: "1",
    title: "Spoken English Basics",
    instructor: "John Doe",
    isFree: true,
    price: "Free",
    rating: 4.5,
    thumbnail: spokenEnglishBasic,
    description:
      "Learn how to introduce yourself, ask and answer basic questions in English.",
  },
  {
    id: "2",
    title: "Advanced English Speaking",
    instructor: "Jane Smith",
    isFree: false,
    price: "$49",
    rating: 4.8,
    thumbnail: advancedSpeaking,
    description:
      "Master complex conversations and gain fluency in advanced English topics.",
  },
  {
    id: "3",
    title: "Grammar Essentials",
    instructor: "Emily Clark",
    isFree: true,
    price: "Free",
    rating: 4.6,
    thumbnail: grammarEssentials,
    description:
      "Strengthen your grammar knowledge for better speaking and writing skills.",
  },
  {
    id: "4",
    title: "Pronunciation Mastery",
    instructor: "Robert Lee",
    isFree: false,
    price: "$39",
    rating: 4.7,
    thumbnail: pronunciationMastery,

    description:
      "Improve your pronunciation and sound more natural in English conversations.",
  },
  {
    id: "5",
    title: "Business Communication",
    instructor: "Sarah Kim",
    isFree: false,
    price: "$59",
    rating: 4.9,
    thumbnail: businessCommunication,
    description:
      "Learn to communicate confidently in professional business settings.",
  },
  {
    id: "6",
    title: "IELTS Preparation",
    instructor: "James White",
    isFree: false,
    price: "$99",
    rating: 4.8,
    thumbnail: ieltsPreparation,
    description:
      "Get ready for IELTS with tips, practice tests, and expert strategies.",
  },
  {
    id: "7",
    title: "Public Speaking",
    instructor: "Amy Brown",
    isFree: false,
    price: "$45",
    rating: 4.6,
    thumbnail: publicSpeaking,
    description:
      "Build confidence and learn to speak effectively in front of an audience.",
  },
  {
    id: "8",
    title: "Conversational Practice",
    instructor: "David Green",
    isFree: true,
    price: "Free",
    rating: 4.4,
    thumbnail: conversationalPractice,
    description:
      "Practice real-life conversations to improve fluency and comprehension.",
  },
  {
    id: "9",
    title: "English for Travel",
    instructor: "Laura Wilson",
    isFree: false,
    price: "$29",
    rating: 4.3,
    thumbnail: englishForTravel,
    description:
      "Essential English phrases and vocabulary for traveling the world.",
  },
  {
    id: "10",
    title: "Email Writing Skills",
    instructor: "Chris Taylor",
    isFree: false,
    price: "$35",
    rating: 4.7,
    thumbnail: emailWriting,
    description:
      "Write professional emails with proper etiquette and structure.",
  },
];

const Morecourse = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCourses(allCourses);
  }, []);

  const handleLoadCourses = () => {
    setCourses(allCourses);
    setLoaded(true);
  };

  const handleEnroll = (course) => {
    const enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];

    // Check if course is already enrolled
    const alreadyEnrolled = enrolled.find((c) => c.id === course.id);
    if (!alreadyEnrolled) {
      enrolled.push(course);
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
    }
    if (course.isFree) {
      alert(`Enrolled in ${course.title}! Redirecting to dashboard...`);
      navigate("/dashboard");
    } else {
      navigate("/payment", {
        state: {
          courseName: course.title,
          price: course.price,
        },
      });
    }
  };

  return (
    <div className="courses-container">
      <h2>📚 Explore Our Courses</h2>
      <div className="courses-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <img src={course.thumbnail} alt={course.title} />
            <h3>{course.title}</h3>
            <p>
              <strong>Instructor:</strong> {course.instructor}
            </p>
            <p className="desc">{course.description}</p>
            <p className="rating">⭐ {course.rating} / 5</p>
            <p className={`price ${course.isFree ? "free" : "paid"}`}>
              {course.price}
            </p>
            <div className="buttons">
              <Link to={`/course/${course.id}`} className="btn explore">
                Explore
              </Link>
              <button
                className="btn enroll"
                onClick={() => handleEnroll(course)}
              >
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Morecourse;
