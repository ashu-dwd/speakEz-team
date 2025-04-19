// StudentReviews.jsx
import React from 'react';
import './Student.css';

const reviews = [
  {
    name: "Aisha Khan",
    text: "I used to struggle with speaking English, but the AI practice helped me gain confidence!",
    rating: 5,
    location: "India",
  },
  {
    name: "John Smith",
    text: "The beginner course was super clear and simple to follow. Loved the interactive lessons!",
    rating: 4,
    location: "USA",
  },
  {
    name: "Li Wei",
    text: "I practiced for my IELTS test with this site and improved my band score from 6.0 to 7.5!",
    rating: 5,
    location: "China",
  },
  {
    name: "Fatima Ali",
    text: "Great for learning on the go. I listen to lessons while commuting.",
    rating: 4,
    location: "UAE",
  },
];

const Student = () => {
  return (
    <div className="review-section">
      <h2 className="review-title">🌟 What Our Students Say</h2>
      <div className="review-grid">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-header">
              <div className="avatar">{review.name.charAt(0)}</div>
              <div>
                <h3>{review.name}</h3>
                <span className="location">{review.location}</span>
              </div>
            </div>
            <p className="review-text">“{review.text}”</p>
            <div className="stars">
              {Array.from({ length: review.rating }, (_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Student;
