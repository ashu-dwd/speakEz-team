import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Volume2, Settings, MessageSquare } from "lucide-react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function VoiceInterface() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [charId, setCharId] = useState("");
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatHistory, setShowChatHistory] = useState(false);

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
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => setIsListening(true);

      recognitionRef.current.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript.trim() !== "") {
          sendToBackend(transcript);
        }
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
  }, [transcript]);

  // Get character ID from location state
  useEffect(() => {
    if (location.state?.charId) {
      setCharId(location.state.charId);
    }
  }, [location.state]);

  // Initialize chat when character ID is available
  useEffect(() => {
    const initializeChat = async () => {
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

        const welcomeMsg = "Welcome! I'm listening. How can I help you today?";
        setResponse(welcomeMsg);
        if (!isMuted) speakResponse(welcomeMsg);

        setChatHistory([{ type: "assistant", content: welcomeMsg }]);
      } catch (err) {
        setError("Error connecting to chat service");
      }
    };

    initializeChat();
  }, [charId, isMuted]);

  const sendToBackend = useCallback(
    async (text) => {
      if (!charId || !roomId || !text.trim()) return;

      setIsLoading(true);
      setChatHistory((prev) => [...prev, { type: "user", content: text }]);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/chat/${charId}/${roomId}`,
          { userMsg: text },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const assistantResponse =
          response.data.charResponse?.mainResponse ||
          "I didn't understand that";
        setResponse(assistantResponse);
        setChatHistory((prev) => [
          ...prev,
          { type: "assistant", content: assistantResponse },
        ]);

        if (!isMuted) speakResponse(assistantResponse);
      } catch (err) {
        setError(err.response?.data?.message || "Error sending message");
      } finally {
        setIsLoading(false);
        setTranscript("");
      }
    },
    [charId, roomId, isMuted]
  );

  const speakResponse = (text) => {
    if (!synthRef.current || isMuted) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not initialized");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      setError(null);
      recognitionRef.current.start();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (synthRef.current?.speaking && !isMuted) {
      synthRef.current.cancel();
    }
  };

  const toggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-gray-900">
      {/* Error display */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded z-50">
          {error}
        </div>
      )}

      {/* Chat history panel */}
      {showChatHistory && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-16 bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 w-4/5 max-w-lg z-50 h-1/2 overflow-hidden flex flex-col">
          <h3 className="text-blue-100 font-medium mb-3">Chat History</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {chatHistory.length > 0 ? (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-blue-100"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No messages yet
              </div>
            )}
          </div>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-blue-200 text-sm py-2 mt-3 rounded-md transition-colors"
            onClick={toggleChatHistory}
          >
            Close History
          </button>
        </div>
      )}

      {/* Main interface */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div
          className={`w-40 h-40 rounded-full bg-gradient-to-b from-blue-400 via-blue-600 to-indigo-800 flex items-center justify-center transition-all duration-300 ${
            isListening
              ? "scale-110 shadow-lg shadow-blue-500/50"
              : isLoading
              ? "scale-105 shadow-md shadow-blue-500/30"
              : "shadow-sm shadow-blue-500/20"
          }`}
        >
          <div className="w-36 h-36 rounded-full bg-gray-900 flex items-center justify-center">
            {isLoading ? (
              <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full bg-blue-600/20 animate-ping"></div>
                <div className="absolute w-16 h-16 rounded-full bg-blue-500/30"></div>
                <div className="w-10 h-10 rounded-full bg-blue-400/50"></div>
              </div>
            )}
          </div>
        </div>

        {/* Response display */}
        {response && !showChatHistory && (
          <div className="absolute -bottom-32 w-80 max-h-24 overflow-y-auto text-center p-4 rounded-xl bg-gray-800/80 backdrop-blur-sm">
            <p className="text-blue-100 text-sm">{response}</p>
          </div>
        )}
      </div>

      {/* Transcript display */}
      {transcript && !showChatHistory && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-4/5 max-w-md z-10">
          <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-lg">
            <p className="text-blue-200 text-sm text-center">"{transcript}"</p>
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div className="absolute bottom-16 flex gap-3 z-10">
        <button
          className={`w-14 h-14 rounded-full ${
            isListening ? "bg-red-500" : "bg-gray-800 hover:bg-gray-700"
          } flex items-center justify-center transition-colors duration-300`}
          onClick={toggleListening}
          disabled={isLoading}
        >
          <Mic className="text-white" size={24} />
        </button>

        <button
          className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-300"
          onClick={toggleMute}
        >
          {isMuted ? (
            <Volume2 className="text-white" size={22} />
          ) : (
            <Volume2 className="text-white" size={22} />
          )}
        </button>

        <button
          className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-300"
          onClick={toggleChatHistory}
        >
          <MessageSquare className="text-white" size={22} />
        </button>
      </div>
    </div>
  );
}
