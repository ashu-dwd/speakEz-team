import React, { useState, useEffect } from 'react';
import '../assets/Practice.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Practice = () => {
  const { charId, roomId } = useParams(); // Get charId and roomId from URL
  const [seconds, setSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    let timer;
    if (isRunning && seconds > 0) {
      timer = setInterval(() => setSeconds(prev => prev - 1), 1000);
    } else if (seconds === 0 && isRunning) {
      handleStop();
    }
    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  const handleStart = () => {
    resetTranscript();
    setSeconds(300);
    setIsRunning(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setIsRunning(false);
    analyzeSpeech();
  };
  const startAIConversation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chat');
      const roomId = response.data.roomId;
      navigate(`/${roomId}`);
    } catch (error) {
      console.error('Error fetching room ID:', error);
    }
  };

  const analyzeSpeech = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      // First: Analyze transcript with AI
      const response = await axios.post('http://localhost:5000/api/analyze', {
        text: transcript
      });
      setAnalysis(response.data.analysis);

      // Second: Send the conversation to /api/chat/charId/roomId
      await axios.post(`http://localhost:5000/api/chat/${charId}/${roomId}`, {
        message: transcript
      });

    } catch (err) {
      console.error(err);
      setAnalysis("Error analyzing speech.");
    } finally {
      setLoading(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const formatTime = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="practice-container has-navbar-spacing">
      <h2>🎤 AI Speech Practice</h2>
      <p className="timer">Timer: {formatTime()}</p>
      <p className="status">{listening ? 'Listening...' : 'Not Listening'} </p>

      <div className="controls">
      <button onClick={startAIConversation} className="ai-chat-button"> Talk to AI</button>
        <button onClick={handleStop} disabled={!isRunning} style={{ backgroundColor: 'red', color: 'white' }}>Stop</button>
      </div>

      <textarea
        value={transcript}
        readOnly
        placeholder="Your speech will appear here..."
        className="transcript-box"
      />

      {loading ? (
        <p className="loading">Analyzing...</p>
      ) : (
        analysis && (
          <div className="analysis">
            <h3>🧠 AI Feedback</h3>
            <p>{analysis}</p>
          </div>
        )
      )}
    </div>
  );
};

export default Practice;
