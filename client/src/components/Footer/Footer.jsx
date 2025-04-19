// Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-logo">SpeakEz</h2>

        <ul className="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/courses">Courses</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>

        <div className="footer-social">
          <a href="#" aria-label="Facebook">🌐</a>
          <a href="#" aria-label="Instagram">📸</a>
          <a href="#" aria-label="YouTube">▶️</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SpeakEz. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
