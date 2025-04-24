import React from "react";
import "./Footer.css"; 
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-col">
          <h4>SpeakEZ</h4>
          <ul className="link">
            <li><Link to="/about"> About Us</Link> </li>
            <li><Link to="/contact"> Contact </Link></li>
            <li><Link to="/blog"> Blog  </Link></li>
            <li><Link to="/developer"> Developers  </Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Courses</h4>
          <ul>
            <li><Link to="/Morecourse">Basic English</Link></li>
            <li><Link to="/Morecourse"> Business English</Link> </li>
            <li><Link to="/Morecourse">IELTS Prep </Link></li>
            <li><Link to="/Morecourse">Fluency Mastery </Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Tools</h4>
          <ul>
            <li><Link to="/practicewithai"> Speech Practice </Link></li>
            <li><Link to="/grammar"> Grammar Notes </Link> </li>
            <li><Link to="/vocabulary"> Vocabulary  </Link> </li>
            <li><Link to="/pronounciation"> Pronunciation Tips </Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/help"> Help Center </Link> </li>
            <li><Link to="/faq">FAQs</Link></li>
            <li> <Link to="/termsofuse">Terms of Use</Link></li>
            <li> <Link to="/privacypolicy">Privacy Policy</Link></li>
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
