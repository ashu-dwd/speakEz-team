import React from "react";
import "../assets/Student.css"; // Make sure to create this CSS file

const reviews = [
  {
    text: "The best app I’ve ever used. I really improved my English with it. Not only pronunciation, fluency, intonation, word stress and listening. But also vocabulary and grammar in an active learning way that makes me feel better and more confident when I speak.",
  },
  {
    text: "I never thought I would be able to get rid of my strong accent... Then I discovered this app. It helped me identify issues with my pronunciation that I was not aware of... There’s already a vast improvement with my speech.",
  },
  {
    text: "I love this app!! It helps me speak English fluently and fix my strong accent. I can see my improvement clearly after 3 months of use... when I try to speak in Google Translate, it is correct nearly 85% of the time, which is much more than before.",
  },
  {
    text: "This app is great. I’m that person that NEVER writes reviews. It’s that good... Amazing easy interface for everyday use, and great discounts; I bought the full version for a year. God bless you developers ❤️",
  },
];

const Student = () => {
  return (
    <section className="review-section">
      <h2>Anybody Can Speak English Confidently</h2>
      <div className="review-container">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <span className="quote-icon">❝</span>
            <p>{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Student;
