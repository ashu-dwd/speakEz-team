import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/Coursedetails.css";

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

const courseData = [
  {
    id: "1",
    title: "Spoken English Basics",
    instructor: "John Doe",
    description:
      "Learn basic conversational English in this beginner-friendly course.",
    details:
      "This course will help you master day-to-day conversational phrases, common greetings, and essential vocabulary for beginners.",
    isFree: true,
    thumbnail: <img src={spokenEnglishBasic} alt="Spoken English Basic" />,
    reviews: [
      "⭐️⭐️⭐️⭐️⭐️ 'Perfect for beginners!' - Rahul",
      "⭐️⭐️⭐️⭐️ 'Very helpful and easy to follow.' - Meena",
    ],
  },
  {
    id: "2",
    title: "Advanced English Speaking",
    instructor: "Jane Smith",
    description:
      "Take your English skills to the next level with advanced techniques.",
    details:
      "Focus on complex sentence structures, idiomatic expressions, and advanced vocabulary to improve fluency.",
    isFree: false,
    thumbnail: <img src={advancedSpeaking} alt="Advanced Speaking English" />,
    reviews: [
      "⭐️⭐️⭐️⭐️ 'My speaking confidence improved drastically!' - Arjun",
      "⭐️⭐️⭐️⭐️⭐️ 'Loved the tips and fluency drills.' - Fatima",
    ],
  },
  {
    id: "3",
    title: "Grammar Essentials",
    instructor: "Emily Clark",
    description:
      "Master the rules of English grammar with this essential guide.",
    details:
      "Covering parts of speech, tenses, punctuation, and more to build a solid grammar foundation.",
    isFree: true,
    thumbnail: <img src={grammarEssentials} alt="Grammar Essentials" />,
    reviews: [
      "⭐️⭐️⭐️⭐️ 'Grammar finally makes sense!' - Kiran",
      "⭐️⭐️⭐️⭐️⭐️ 'Great examples and quizzes.' - Divya",
    ],
  },
  {
    id: "4",
    title: "Pronunciation Mastery",
    instructor: "Robert Lee",
    description: "Improve your pronunciation for clearer communication.",
    details:
      "Techniques and exercises to refine your accent and articulate better.",
    isFree: false,
    thumbnail: <img src={pronunciationMastery} alt="Pronunciation Mastery" />,
    reviews: [
      "⭐️⭐️⭐️⭐️ 'Really helped me sound more fluent.' - Ali",
      "⭐️⭐️⭐️⭐️⭐️ 'Loved the native speaker comparisons!' - Sanya",
    ],
  },
  {
    id: "5",
    title: "Business Communication",
    instructor: "Sarah Kim",
    description:
      "Learn how to speak and write effectively in professional settings.",
    details:
      "Master workplace communication, business writing, and presentation skills.",
    isFree: false,
    thumbnail: <img src={businessCommunication} alt="Business Communication" />,
    reviews: [
      "⭐️⭐️⭐️⭐️⭐️ 'Perfect for my job!' - Anjali",
      "⭐️⭐️⭐️⭐️ 'Clear and practical content.' - Ramesh",
    ],
  },
  {
    id: "6",
    title: "IELTS Preparation",
    instructor: "James White",
    description:
      "Prepare for your IELTS test with expert strategies and practice.",
    details:
      "Includes practice questions, timing strategies, and scoring tips.",
    isFree: false,
    thumbnail: <img src={ieltsPreparation} alt="IELTS Preparation" />,
    reviews: [
      "⭐️⭐️⭐️⭐️⭐️ 'Helped me score 8 bands!' - Neha",
      "⭐️⭐️⭐️⭐️ 'Great mock test examples.' - Rohit",
    ],
  },
  {
    id: "7",
    title: "Public Speaking",
    instructor: "Amy Brown",
    description: "Build confidence and become a persuasive public speaker.",
    details:
      "Practice techniques for impactful speeches, managing nerves, and engaging audiences.",
    isFree: false,
    thumbnail: <img src={publicSpeaking} alt="Public Speaking" />,
    reviews: [
      "⭐️⭐️⭐️⭐️⭐️ 'Now I can speak confidently!' - Aman",
      "⭐️⭐️⭐️⭐️ 'Really good for beginners.' - Sheetal",
    ],
  },
  {
    id: "8",
    title: "Conversational Practice",
    instructor: "David Green",
    description: "Practice speaking English in real-life scenarios.",
    details: "Interactive conversations for everyday situations and fluency.",
    isFree: true,
    thumbnail: (
      <img src={conversationalPractice} alt="Conversational Practice" />
    ),
    reviews: [
      "⭐️⭐️⭐️⭐️ 'Fun way to learn!' - Priya",
      "⭐️⭐️⭐️⭐️⭐️ 'I practice daily now.' - Suresh",
    ],
  },
  {
    id: "9",
    title: "English for Travel",
    instructor: "Laura Wilson",
    description: "Learn travel-related English to help you navigate the world.",
    details:
      "Covers airport, hotel, restaurant, and sightseeing vocabulary and expressions.",
    isFree: false,
    thumbnail: <img src={englishForTravel} alt="English for Travel" />,
    reviews: [
      "⭐️⭐️⭐️⭐️⭐️ 'Used it on my Thailand trip!' - Kavita",
      "⭐️⭐️⭐️⭐️ 'Very practical and useful.' - Faizan",
    ],
  },
  {
    id: "10",
    title: "E-mail Writing",
    instructor: "Chris Taylor",
    description:
      "Unlock the power of professional communication with our Email Writing Skills course.",
    details:
      "Learn to craft professional emails with clarity, tone, and structure. Master formatting, subject lines, salutations, and writing for different contexts such as work, academics, or casual use.",
    isFree: false,
    thumbnail: <img src={emailWriting} alt="Email Writing Skills" />,
    reviews: [
      "⭐️⭐️⭐️⭐️ 'Very useful for students.' - Tara",
      "⭐️⭐️⭐️⭐️⭐️ 'Gives you a proper way of writing E-mails.' - Dev",
    ],
  },
];

const Coursedetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = courseData.find((c) => c.id === courseId);

  if (!course) return <h2>Course not found</h2>;

  const handleEnroll = () => {
    if (course.isFree) {
      alert(`Course "${course.title}" added to your dashboard.`);
      navigate("/dashboard");
    } else {
      navigate("/payment");
    }
  };

  return (
    <div className="course-detail-container">
      <h1 className="course-title">{course.title}</h1>
      <div className="course-thumbnail">{course.thumbnail}</div>

      <div className="course-meta">
        <p>
          <strong>Instructor:</strong> {course.instructor}
        </p>
        <p>
          <strong>Summary:</strong> {course.description}
        </p>
        <p>
          <strong>About the Course:</strong> {course.details}
        </p>
        <p className={course.isFree ? "free-label" : "premium-label"}>
          {course.isFree ? "Free Course" : "Premium Course"}
        </p>
      </div>

      <button className="enroll-btn" onClick={handleEnroll}>
        {course.isFree ? "Enroll for Free" : "Buy Now"}
      </button>

      <div className="student-reviews">
        <h2>What Students Say</h2>
        <ul>
          {course.reviews?.map((review, index) => (
            <li key={index}>{review}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Coursedetail;
