import React from 'react';
import '../assets/Developer.css';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const team = [
  {
    role: 'Frontend Developer',
    name: 'Masoom Sharma',
    bio: 'Builds stunning UIs with React.',
    work: [
      'Implemented responsive design for SpeakEZ',
      'Connect with the backend via APIs',
      'Build UI components like buttons, forms, navigation bars and manhy other',
    ],
    github: 'https://github.com/Masoom302021',
    linkedin: 'http://www.linkedin.com/in/masoom-sharma-36a216339',
  },
  {
    role: 'Backend Developer',
    name: 'Raghavendra  Dwivedi',
    bio: 'Creates scalable APIs and database systems.',
    work: [
      'Designed  APIs with Express & MongoDB',
      'Handled user authentication & payment integration',
      'Connect frontend to database using Express + MongoDB',
    ],
    github: 'https://github.com/ashu-dwd',
    linkedin: 'http://www.linkedin.com/in/raghav-dwd',
  },
  {
    role: 'UI/UX Designer',
    name: 'Hussaina Mankda',
    bio: 'Crafts clean and engaging user experiences.',
    work: [
      'Researches how users interact with a product',
      'Conducts usability tests to find and fix pain points',
      'Collaborated with frontend team for pixel-perfect UI',
    ],
    github: 'https://github.com/Hussaina007',
    linkedin: 'https://www.linkedin.com/in/husaina-makda-3756a22b6',
  },
];

const getInitials = (name) => {
  const names = name.split(' ');
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
  return initials;
};

const Developer = () => {
  return (
    <div className="team-page">
      <h1 className="team-title">Meet Our Team</h1>
      <div className="team-grid">
        {team.map((member, index) => (
          <div key={index} className="team-card">
            <div className="team-avatar">{getInitials(member.name)}</div>
            <h2 className="team-name">{member.name}</h2>
            <p className="team-role">{member.role}</p>
            <p className="team-bio">{member.bio}</p>
            <ul className="team-work">
              {member.work.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
            <div className="team-links">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={24} />
              </a>
              <a href={member.github} target="_blank" rel="noopener noreferrer">
                <FaGithub size={24} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Developer;
