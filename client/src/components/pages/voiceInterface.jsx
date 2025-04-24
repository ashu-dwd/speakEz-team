import { useState, useEffect, useRef } from "react";
import { Mic, X } from "lucide-react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function VoiceInterface() {
  const [isActive, setIsActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [charId, setCharId] = useState("");
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const location = useLocation();

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Set up speech synthesis
    synthRef.current = window.speechSynthesis;

    // Set up speech recognition if available
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcriptText = event.results[event.resultIndex][0].transcript;
        setTranscript(transcriptText);
        sendToBackend(transcriptText);
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current?.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Get character ID from location state
  useEffect(() => {
    if (location.state?.charId) {
      setCharId(location.state.charId);
    }
  }, [location.state]);

  // Fetch room ID when character ID is available
  useEffect(() => {
    const fetchRoomId = async () => {
      if (!charId) return;

      try {
        const response = await axios.post(
          `http://localhost:5000/api/chat`,
          { charId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRoomId(response.data.roomId);
      } catch (err) {
        setError("Error fetching room ID");
      }
    };

    fetchRoomId();
  }, [charId]);

  // Send message to backend
  const sendToBackend = async (text) => {
    if (!charId || !roomId) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/chat/${charId}/${roomId}`,
        { userMsg: text },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResponse(response.data.charResponse.mainResponse);
      speakResponse(response.data.charResponse.mainResponse);
    } catch (err) {
      setError("Error sending message to backend");
    } finally {
      setIsLoading(false);
    }
  };

  // Speak response using TTS
  const speakResponse = (text) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    synthRef.current.speak(utterance);
  };

  // Toggle listening state
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not initialized");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      setResponse("");
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Close the interface
  const handleClose = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (synthRef.current?.speaking) {
      synthRef.current.cancel();
    }
    setIsActive(false);
  };

  if (!isActive) return null;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-black">
      {/* Error display */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* Main circular element */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-b from-white via-blue-100 to-blue-500 flex items-center justify-center transition-all duration-300 ${
            isListening
              ? "scale-110 animate-pulse"
              : isLoading
              ? "scale-105"
              : ""
          }`}
        >
          {isLoading && (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        {response && (
          <div className="absolute -bottom-24 w-64 text-center">
            <p className="text-white text-sm opacity-80">{response}</p>
          </div>
        )}
      </div>

      {/* Transcript display */}
      {transcript && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-4/5 max-w-md">
          <p className="text-white text-sm text-center opacity-70">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Control buttons */}
      <div className="absolute bottom-16 flex gap-4">
        <button
          className={`w-12 h-12 rounded-full ${
            isListening ? "bg-red-500" : "bg-gray-800"
          } flex items-center justify-center transition-colors duration-300`}
          onClick={toggleListening}
          disabled={isLoading}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          <Mic className="text-white" size={22} />
        </button>
        <button
          className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"
          onClick={handleClose}
          aria-label="Close voice interface"
        >
          <X className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
