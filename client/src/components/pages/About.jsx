import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>

      <p className="about-intro">
        Welcome to <span className="highlight">LinguaLift</span> – your smart and friendly English learning companion!
      </p>

      <section className="about-section">
        <h2 className="section-title">🎯 Our Mission</h2>
        <p className="section-text">
          To make English learning accessible, engaging, and enjoyable for learners of all ages and backgrounds.
        </p>
      </section>

      <section className="about-section">
        <h2 className="section-title">🚀 What We Offer</h2>
        <ul className="offer-list">
          <li>📚 Structured lessons for all levels – beginner to advanced</li>
          <li>🎮 Gamified learning paths that keep you motivated</li>
          <li>🗣️ Practice tools for speaking, listening, reading & writing</li>
          <li>🧩 Vocabulary builders and grammar guides</li>
          <li>🧑‍🏫 Progress tracking and personalized feedback</li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="section-title">🌍 Why Choose Us?</h2>
        <p className="section-text">
          We believe language learning should never feel like a chore. That’s why we’ve created a platform that combines
          smart technology, friendly guidance, and fun content to keep you coming back for more.
        </p>
      </section>
    </div>
  );
};

export default About;
