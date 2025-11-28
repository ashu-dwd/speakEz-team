import React from "react";
import "../assets/CTA.css";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Master a New Language?</h2>
          <p className="cta-description">
            Join thousands of learners who are already speaking confidently.
            Start your journey today with our AI-powered platform.
          </p>
          <div className="cta-buttons">
            <button
              className="cta-button primary"
              onClick={() => navigate("/signup")}
            >
              Get Started for Free
              <ArrowRight size={20} className="ml-2" />
            </button>
            <button
              className="cta-button secondary"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="cta-visual">
          {/* Abstract decorative elements */}
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
