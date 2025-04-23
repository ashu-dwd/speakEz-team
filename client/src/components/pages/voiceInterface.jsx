import { useState, useEffect, useRef } from "react";
import { Mic, X } from "lucide-react";
import axios from "axios";
import { useNavigation, useLocation } from "react-router-dom";

export default function VoiceInterface() {
  const [isActive, setIsActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [suggestedReply, setSuggestedReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [charId, setCharId] = useState("q6zgrKfJ ");

  // const navigate = useNavigation();
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  const location = useLocation();

  // useEffect(() => {
  //   if (location.state?.charId) {
  //     setCharId(location.state.charId || "q6zgrKfJ");
  //   }
  // }, [location.state]);

  //for testing
  useEffect(() => {
    setCharId("q6zgrKfJ");
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        // Send to backend once we have a transcript
        sendToBackend(transcriptText);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.error("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  //fetching the roomId from the backend
  useEffect(() => {
    const fetchRoomId = async () => {
      console.log(charId);
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
        console.log("Room ID:", response.data.roomId);
      } catch (error) {
        console.error("Error fetching room ID:", error);
      }
    };
    fetchRoomId();
  }, []);

  // Function to handle sending transcript to backend
  const sendToBackend = async (text) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/chat/${charId}/WhvvQvBtBm`,
        { userMsg: text },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResponse(response.data.charResponse.mainResponse);
      setSuggestedReply(response.data.charResponse.suggestedReply);
      speakResponse(response.data.charResponse.mainResponse);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending to backend:", error);
      setIsLoading(false);
    }
  };

  // Function to speak the response using text-to-speech
  const speakResponse = (text) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      synthRef.current.speak(utterance);
    }
  };

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      setResponse("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleClose = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    }
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    setIsActive(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-black">
      {isActive && (
        <>
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
              {transcript && !isLoading && response && (
                <div className="absolute -bottom-24 w-64 text-center">
                  <p className="text-white text-sm opacity-80">{response}</p>
                </div>
              )}
            </div>
          </div>

          {/* Transcript display */}
          {transcript && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-4/5 max-w-md">
              <p className="text-white text-sm text-center opacity-70">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Control buttons at bottom */}
          <div className="absolute bottom-16 flex gap-4">
            <button
              className={`w-12 h-12 rounded-full ${
                isListening ? "bg-red-500" : "bg-gray-800"
              } flex items-center justify-center transition-colors duration-300`}
              onClick={toggleListening}
            >
              <Mic className="text-white" size={22} />
            </button>
            <button
              className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"
              onClick={handleClose}
            >
              <X className="text-white" size={22} />
            </button>
          </div>

          {/* Settings button in the corner */}
          <div className="absolute top-4 right-4">
            <button className="text-white opacity-70 hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
