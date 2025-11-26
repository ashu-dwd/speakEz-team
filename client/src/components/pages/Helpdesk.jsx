import React, { useState } from 'react';
import './Helpdesk.css';

const HelpDesk = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const newMessage = { from: 'user', text: question };
    setMessages(prev => [...prev, newMessage]);
    setLoading(true);
    setQuestion('');

    setTimeout(() => {
      const fakeAnswer = `That's a great question! Here's a helpful answer for: "${newMessage.text}" 🤖`;
      setMessages(prev => [...prev, { from: 'ai', text: fakeAnswer }]);
      setLoading(false);
    }, 1500);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') handleAsk();
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">AI Help Desk</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-bubble ai">Typing...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleEnter}
        />
        <button onClick={handleAsk}>Send</button>
      </div>
    </div>
  );
};

export default HelpDesk;
