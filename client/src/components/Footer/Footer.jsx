import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-col">
          <h4>SpeakEZ</h4>
          <ul>
            <li>About Us</li>
            <li>Contact</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Courses</h4>
          <ul>
            <li>Basic English</li>
            <li>Business English</li>
            <li>IELTS Prep</li>
            <li>Fluency Mastery</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Tools</h4>
          <ul>
            <li>Speech Practice</li>
            <li>Grammar Checker</li>
            <li>Vocabulary Builder</li>
            <li>Pronunciation AI</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>FAQs</li>
            <li>Terms of Use</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-logo">SpeakEZ</div>
        <div className="footer-socials">
          <i className="fab fa-facebook-f" />
          <i className="fab fa-instagram" />
          <i className="fab fa-youtube" />
          <i className="fab fa-tiktok" />
        </div>
        <p className="footer-copy">© 2025 SpeakEZ. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
