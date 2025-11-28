import React from 'react'
import '../assets/Contact.css';

const contacts = [
  
    {
      name: "Raghavendra  Dwivedi ",
      role: "Technical support",
      email: "dwivediji425@gmail.com",
      phone: "+91 8887948767"
    },
    {
      name: "Hussaina Mankda",
      role: "Course-Related Queries",
      email: "hussainamankda07@gmail.com",
      phone: "+91 8140647374"
    },
    {
      name: "Masoom Sharma",
      role: "AI/Voice Features ",
      email: "masoomsharma300@gmail.com",
      phone: "+91 9001907881"
    }
];


const Contact = () => {

  return (  <div className="contact-container">
  <h1 className="contact-title">Contact Our Team</h1>
  <p className="contact-intro">
    Have a question? Reach out to the right person below — or email us at:{" "}
    <a href="mailto:support@speakez.app" className="company-email">support@speakez.app</a>
  </p>

  <div className="contact-grid">
    {contacts.map((person, index) => (
      <div className="contact-card" key={index}>
        <h2>{person.name}</h2>
        <p><strong>{person.role}</strong></p>
        <p className="responsibility">{person.responsibility}</p>
        <p>📧 <a href={`mailto:${person.email}`}>{person.email}</a></p>
        <p>📞 {person.phone}</p>
      </div>
    ))}
  </div>
</div>
);
};
export default Contact

