// FAQ.jsx
import React, { useState } from 'react';
import './Faq.css';

const faqs = [
  {
    question: "How do I start learning English here?",
    answer: "Just sign up, choose a course, and begin! Our AI will guide you step-by-step.",
  },
  {
    question: "Are the courses free?",
    answer: "We offer both free and premium courses. You can try basic lessons without payment.",
  },
  {
    question: "Can I practice speaking with AI?",
    answer: "Yes! Our AI speaking practice helps you improve fluency and confidence.",
  },
  {
    question: "Do I get a certificate?",
    answer: "Yes, upon course completion you’ll receive a downloadable certificate.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">❓ Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => toggle(index)}
            >
              {faq.question}
              <span>{activeIndex === index ? '−' : '+'}</span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="contact-box">
        <p>Still have questions? <a href="/contact">Contact us</a> and we’ll help you out!</p>
      </div>
    </div>
  );
};

export default Faq;
