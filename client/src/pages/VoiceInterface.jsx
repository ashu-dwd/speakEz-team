import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RefreshCw,
  Zap,
  Droplet,
  Mic,
  MicOff,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function VoiceInteractiveCircle() {
  const [pulse, setPulse] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(2000);
  const [colorScheme, setColorScheme] = useState("blue");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [welcomePlayed, setWelcomePlayed] = useState(false);

  // API states
  const [charId, setCharId] = useState("");
  const [roomId, setRoomId] = useState("");

  // References
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const isRecognitionActiveRef = useRef(false); 

  // Get charId from URL params
  const params = useParams();

  useEffect(() => {
    if (params.charId) {
      setCharId(params.charId);
    }
  }, [params]);

  // Fetch room ID when charId is available
  useEffect(() => {
    if (!charId) return;

    const fetchRoomId = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/chat`,
          {
            charId: charId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        if (response.data.success) {
          setRoomId(response.data.roomId);
          console.log("Room ID:", response.data.roomId);
        } else {
          console.error("Error fetching room ID:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching room ID:", error);
      }
    };

    fetchRoomId();
  }, [charId]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const userText = event.results[0][0].transcript;
        setTranscript(userText);
        handleSpeechInput(userText);
      };

      recognitionRef.current.onend = () => {
        console.log("Recognition ended");
        isRecognitionActiveRef.current = false;
        setIsListening(false);
        
        // Only restart if not speaking and after a delay
        if (!isSpeaking) {
          setTimeout(() => {
            if (!isRecognitionActiveRef.current && !isSpeaking) {
              startListening();
            }
          }, 1000);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error, event);
        isRecognitionActiveRef.current = false;
        setIsListening(false);
        
        // Only try to restart if it's not an abort error
        if (event.error !== "aborted" && !isSpeaking) {
          setTimeout(() => {
            startListening();
          }, 2000); // Longer delay after real errors
        }
      };
  
      // Speech synthesis voices ready
      synthRef.current.onvoiceschanged = () => {
        const utterance = new SpeechSynthesisUtterance("");
        utterance.onend = () => {
          setIsSpeaking(false);
          if (!isListening && !isSpeaking && !isRecognitionActiveRef.current) {
            startListening();
          }
        };
      };
    } else {
      setStatus("Speech recognition not supported in this browser");
    }
  
    // Play welcome message on component mount
    if (!welcomePlayed) {
      setTimeout(() => {
        const welcomeMessage = "Welcome to the interactive circle! You can speak to control the animations or ask questions.";
        speak(welcomeMessage);
        setResponse(welcomeMessage);
        setWelcomePlayed(true);
      }, 1000);
    }
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.log("Error stopping recognition on unmount:", err);
        }
      }
      if (synthRef.current) synthRef.current.cancel();
      isRecognitionActiveRef.current = false;
    };
  }, []);
   
  // Animation effect
  useEffect(() => {
    let intervalId;

    if (isAnimating) {
      intervalId = setInterval(() => {
        setPulse((prev) => !prev);
      }, animationSpeed);
    }

    return () => clearInterval(intervalId);
  }, [isAnimating, animationSpeed]);

  // Monitor speaking state to toggle listening
  useEffect(() => {
    if (!isSpeaking && !isListening && !isRecognitionActiveRef.current) {
      startListening();
    }
  }, [isSpeaking, isListening]);

  // Function to speak text
  const speak = (text) => {
    if (synthRef.current) {
      // Stop listening while speaking
      if (isListening || isRecognitionActiveRef.current) {
        stopListening();
      }

      synthRef.current.cancel();
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Set up the onend event for each utterance
      utterance.onend = () => {
        setIsSpeaking(false);
        // Auto-start listening when speech ends
        if (!isListening && !isRecognitionActiveRef.current) {
          setTimeout(() => {
            startListening();
          }, 500);
        }
      };

      synthRef.current.speak(utterance);
    }
  };

  // Check for microphone permissions
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' })
        .then((permissionStatus) => {
          console.log("Microphone permission status:", permissionStatus.state);
          
          if (permissionStatus.state === 'denied') {
            setStatus("Microphone access denied. Please allow microphone access in your browser settings.");
          }
          
          permissionStatus.onchange = () => {
            console.log("Microphone permission status changed:", permissionStatus.state);
            if (permissionStatus.state === 'granted') {
              setStatus("Microphone access granted");
              // Try to start listening again if permissions are granted
              if (!isRecognitionActiveRef.current && !isSpeaking) {
                setTimeout(startListening, 500);
              }
            }
          };
        });
    }
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      if (!isRecognitionActiveRef.current && !isSpeaking) {
        console.log("Starting speech recognition");
        recognitionRef.current.start();
        isRecognitionActiveRef.current = true;
        setIsListening(true);
      } else {
        console.log("Cannot start listening: recognition already active or speaking");
      }
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      isRecognitionActiveRef.current = false;
      setIsListening(false);
      
      // Try again after a delay if it was an InvalidStateError
      if (error.name === "InvalidStateError") {
        console.log("Recognition was already running, resetting state");
        try {
          recognitionRef.current.stop();
        } catch (stopError) {
          console.log("Error stopping recognition:", stopError);
        }
        
        setTimeout(() => {
          if (!isRecognitionActiveRef.current && !isSpeaking) {
            startListening();
          }
        }, 1000);
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        console.log("Stopping speech recognition");
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      } finally {
        isRecognitionActiveRef.current = false;
        setIsListening(false);
      }
    }
  };

  // Toggle speech recognition (button handler)
  const toggleListening = () => {
    if (isRecognitionActiveRef.current) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Handle speech input
  const handleSpeechInput = async (userText) => {
    setStatus("Processing your request...");

    try {
      // Stop listening while processing
      stopListening();

      if (!charId || !roomId) {
        setStatus("Error: Character or room not initialized");
        setTimeout(() => {
          if (!isRecognitionActiveRef.current && !isSpeaking) {
            startListening();
          }
        }, 1000);
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/chat/ai`,
        { userMsg: userText, charId, roomId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        // Extract mainResponse from the returned data structure
        const responseData = res.data.charResponse;
        const mainResponse = typeof responseData === 'object' ? 
          responseData.mainResponse : 
          responseData;
        
        setResponse(mainResponse);
        speak(mainResponse);
        setStatus("");
      } else {
        setStatus("Error processing your request");
        // Auto-restart listening if there's an error
        setTimeout(() => {
          if (!isRecognitionActiveRef.current && !isSpeaking) {
            startListening();
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error processing speech input:", error);
      setStatus("Error connecting to server");
      
      // Auto-restart listening if there's an error after a delay
      setTimeout(() => {
        if (!isRecognitionActiveRef.current && !isSpeaking) {
          startListening();
        }
      }, 2000);
    }
  };

  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  const increaseSpeed = () => {
    setAnimationSpeed((prev) => Math.max(500, prev - 500));
  };

  const decreaseSpeed = () => {
    setAnimationSpeed((prev) => Math.min(5000, prev + 500));
  };

  const changeColor = () => {
    const colors = ["blue", "purple", "green", "pink"];
    const currentIndex = colors.indexOf(colorScheme);
    const nextIndex = (currentIndex + 1) % colors.length;
    setColorScheme(colors[nextIndex]);
  };

  const fetchRandomData = async () => {
    setLoading(true);
    setStatus("Fetching data...");

    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const message = `Data fetched! Title: ${response.data.title.substring(
        0,
        20
      )}...`;
      setStatus(message);
      setResponse(message);
      speak(message);

      // Change animation based on response
      setAnimationSpeed(1500);
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    } catch (error) {
      const errorMsg = "Error fetching data";
      setStatus(errorMsg);
      setResponse(errorMsg);
      speak(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getGradientClass = () => {
    switch (colorScheme) {
      case "purple":
        return "from-purple-500 to-white";
      case "green":
        return "from-green-500 to-white";
      case "pink":
        return "from-pink-500 to-white";
      default:
        return "from-blue-500 to-white";
    }
  };

  const getSecondaryGradientClass = () => {
    switch (colorScheme) {
      case "purple":
        return "to-purple-300";
      case "green":
        return "to-green-300";
      case "pink":
        return "to-pink-300";
      default:
        return "to-blue-300";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-900 p-6">
      <div
        className={`relative w-64 h-64 rounded-full bg-gradient-to-br ${getGradientClass()} overflow-hidden transition-all duration-1000 ease-in-out ${
          pulse ? "scale-105" : "scale-100"
        } ${loading ? "animate-pulse" : ""}`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br from-transparent ${getSecondaryGradientClass()} opacity-70 ${
            isAnimating ? "animate-pulse" : ""
          }`}
        ></div>
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white rounded-full blur-md animate-pulse"></div>
        <div
          className={`absolute -inset-1/4 bg-gradient-to-t from-transparent to-white opacity-20 ${
            isAnimating ? "animate-spin" : ""
          } duration-8000`}
        ></div>

        {/* Voice activity indicator */}
        {isListening && (
          <div className="absolute inset-0 border-4 border-white rounded-full animate-ping opacity-50"></div>
        )}

        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute inset-0 border-4 border-blue-400 rounded-full animate-pulse opacity-70"></div>
        )}
      </div>

      {/* Speech text display */}
      <div className="mt-6 w-full max-w-lg">
        {transcript && (
          <div className="mb-3 bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-400">You said:</p>
            <p className="text-white">{transcript}</p>
          </div>
        )}

        {response && (
          <div className="mb-3 bg-gray-700 p-3 rounded-lg">
            <p className="text-sm text-gray-400">Response:</p>
            <p className="text-white">{response}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={toggleListening}
          className={`flex items-center gap-2 ${
            isListening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white px-4 py-2 rounded-full transition-colors`}
          disabled={isSpeaking}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>

        <button
          onClick={toggleAnimation}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
        >
          {isAnimating ? <Pause size={20} /> : <Play size={20} />}
          {isAnimating ? "Pause" : "Play"}
        </button>

        <button
          onClick={decreaseSpeed}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
          disabled={animationSpeed >= 5000}
        >
          Slower
        </button>

        <button
          onClick={increaseSpeed}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
          disabled={animationSpeed <= 500}
        >
          Faster
        </button>

        <button
          onClick={changeColor}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
        >
          <Droplet size={20} />
          Change Color
        </button>

        <button
          onClick={fetchRandomData}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
          disabled={loading}
        >
          {loading ? (
            <RefreshCw size={20} className="animate-spin" />
          ) : (
            <Zap size={20} />
          )}
          Fetch Data
        </button>
      </div>

      {status && (
        <div className="mt-4 text-white bg-gray-800 px-4 py-2 rounded-full">
          {status}
        </div>
      )}

      <div className="mt-4 text-gray-400">
        Animation Speed: {animationSpeed}ms | Color: {colorScheme} |
        {isSpeaking ? " Speaking" : isListening ? " Listening" : " Idle"}
      </div>
    </div>
  );
}