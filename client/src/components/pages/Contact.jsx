import React from 'react';
import './Contact.css';

const Contact = () => {
  const team = [
    { name: 'Aarav Sharma', email: 'aarav@example.com' },
    { name: 'Priya Verma', email: 'priya@example.com' },
    { name: 'Rohan Mehta', email: 'rohan@example.com' },
  ];

  return (
    <div className="contact-container">
      <h2>📬 Contact Our Team</h2>
      <div className="contact-cards">
        {team.map((member, index) => (
          <div key={index} className="contact-card">
            <h3>{member.name}</h3>
            <p>{member.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
