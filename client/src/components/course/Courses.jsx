import React from 'react';
import "./Courses.css"; 
import { Link } from 'react-router-dom';

const courses = [
  {
    title: 'Beginner English',
    description: 'Perfect for learners just getting started!',
    points: [
      'Basic vocabulary & grammar',
      'Common phrases for daily life',
      'Simple conversations',
    ],
    price: '$19.99',
    tag: 'Great for kids, students, or adults starting from scratch.',
  },
  {
    title: 'Grammar & Vocabulary Booster',
    description: 'Strengthen your foundation and expand your word power.',
    points: [
      'Tenses, sentence structures',
      'Word usage and common errors',
      'Topic-based vocabulary',
    ],
    price: '$24.99',
    tag: 'Includes interactive quizzes and examples.',
  },
  {
    title: 'AI Speaking Practice',
    description: 'Practice real conversations with our smart AI buddy.',
    points: [
      'Everyday dialogues',
      'Pronunciation & fluency',
      'Real-world speaking situations',
    ],
    price: '$29.99',
    tag: 'Speak freely, no fear of judgment!',
  },
  {
    title: 'Reading & Listening Skills',
    description: 'Improve comprehension through stories, podcasts, and dialogues.',
    points: [
      'Understand native-level English',
      'Follow audio stories and answer questions',
      'Build reading confidence',
    ],
    price: '$21.99',
    tag: 'Fun content + follow-up exercises.',
  },
  {
    title: 'English for Work & Interviews',
    description: 'Build your professional English for career success.',
    points: [
      'Business communication',
      'Writing emails and resumes',
      'Interview practice',
    ],
    price: '$34.99',
    tag: 'Perfect for job seekers and professionals.',
  },
  {
    title: 'Exam Preparation (Coming Soon!)',
    description: 'We’re working on courses for IELTS, TOEFL, and Spoken English Tests.',
    points: ['IELTS', 'TOEFL', 'Spoken English Practice'],
    price: 'Coming Soon',
    tag: 'Stay tuned!',
  },
];

const Courses = () => { 
  return (
    <div className="course-container">
      <h2 className="course-title">📚 Courses We Offer</h2>
      <div className="course-grid">
        {courses.map((course, index) => (
          <div className="course-card" key={index}>
            <div className="course-card-header">
              <h3 className="course-card-title">{course.title}</h3>
              <span className="course-price">{course.price}</span>
            </div>
            <p className="course-desc">{course.description}</p>
            <ul className="course-list">
              {course.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            <p className="course-tag">{course.tag}</p>
          </div>
        ))}
      </div>
      <div className="course-button-container">
      <Link to="/Morecourse">
  <button className="course-button">Join Now</button>
</Link>
      </div>
    </div>
  );
};

export default Courses;
