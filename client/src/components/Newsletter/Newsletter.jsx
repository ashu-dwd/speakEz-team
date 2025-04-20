import React, { useState } from "react";
import "./Newsletter.css";

const Newsletter = () => {
  const [showModal, setShowModal] = useState(false);

  const packages = [
    {
      name: "Regular",
      price: "$9.99/month",
      features: ["Basic lessons", "Limited practice", "No AI feedback"],
    },
    {
      name: "Infinity",
      price: "$19.99/month",
      features: ["Unlimited lessons", "Practice modules", "Standard AI feedback"],
    },
    {
      name: "Infinity Pro",
      price: "$29.99/month",
      features: ["Everything in Infinity", "Advanced AI feedback", "Progress analytics", "Personalized guidance"],
    },
  ];

  return (
    <section className="newsletter">
      <div className="newsletter-content">
        <div className="newsletter-image">
          <div className="planet-circle">
            <span className="pro-badge">Pro</span>
          </div>
        </div>
        <h2>Subscribe to Pro Access</h2>
        <button className="learn-more-btn" onClick={() => setShowModal(true)}>
          Learn More About SpeakEz Pro
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Select Your Plan</h3>
            <div className="packages">
              {packages.map((pkg, index) => (
                <div key={index} className="package-card">
                  <h4>{pkg.name}</h4>
                  <p className="price">{pkg.price}</p>
                  <ul>
                    {pkg.features.map((feat, i) => (
                      <li key={i}>✅ {feat}</li>
                    ))}
                  </ul>
                  <button className="choose-btn">Choose</button>
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowModal(false)}>✖ Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Newsletter;

