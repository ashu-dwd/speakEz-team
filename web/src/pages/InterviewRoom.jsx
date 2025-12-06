import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "../utils/axios";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaPlay,
  FaPause,
  FaRedo,
} from "react-icons/fa";

/**
 * Interview Room Page - Video interface for AI-powered interview practice
 */
const InterviewRoom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // State management
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [session, setSession] = useState(null);
  const [interviewState, setInterviewState] = useState("connecting"); // connecting, setup, active, paused, completed

  // Media state
  const [stream, setStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  // Interview content
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [feedback, setFeedback] = useState("");
  const [transcript, setTranscript] = useState([]);

  // Speech recognition
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [liveSpeechText, setLiveSpeechText] = useState(""); // Real-time speech display

  // Refs
  const userVideoRef = useRef();
  const aiAvatarRef = useRef();
  const recognitionRef = useRef();

  // Get current user
  useEffect(() => {
    const getCurrentUser = () => {
      try {
        const localAuth = localStorage.getItem("auth");
        const sessionAuth = sessionStorage.getItem("auth");
        const authContent = localAuth || sessionAuth;
        if (!authContent) {
          navigate("/login");
          return null;
        }
        const { user } = JSON.parse(authContent);
        return user || null;
      } catch (err) {
        navigate("/login");
        return null;
      }
    };

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, [navigate]);

  // Initialize media and socket connection
  useEffect(() => {
    if (!user || !sessionId) return;

    initializeMedia();
    initializeSocket();
    loadSession();

    return () => {
      cleanup();
    };
  }, [user, sessionId]);

  // Initialize user media (camera/microphone)
  const initializeMedia = async () => {
    try {
      // Try to get both video and audio first
      let mediaStream = null;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Successfully accessed camera and microphone");
      } catch (videoError) {
        // If video fails, try audio only (microphone is essential for interview)
        console.warn("Camera not available, trying audio only:", videoError);
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          console.log("Successfully accessed microphone (audio-only mode)");
          alert(
            "Camera not found. Interview will continue in audio-only mode. Make sure you have a microphone connected."
          );
        } catch (audioError) {
          console.error("Could not access microphone:", audioError);
          throw new Error(
            "Microphone access is required for AI interviews. Please connect a microphone and grant permissions."
          );
        }
      }

      setStream(mediaStream);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = mediaStream;
      }

      // Initialize speech recognition
      initializeSpeechRecognition();

      // Initialize speech synthesis
      if ("speechSynthesis" in window) {
        console.log("Speech synthesis is available");
        setSpeechSynthesis(window.speechSynthesis);

        // Test TTS availability
        const voices = window.speechSynthesis.getVoices();
        console.log("Available voices:", voices.length);

        // If no voices available yet, wait for them to load
        if (voices.length === 0) {
          console.log("Waiting for voices to load...");
          window.speechSynthesis.onvoiceschanged = () => {
            const loadedVoices = window.speechSynthesis.getVoices();
            console.log("Voices loaded:", loadedVoices.length);
            if (loadedVoices.length > 0) {
              console.log("TTS voices now available!");
            }
          };
        }

        // Alert user if no voices after a delay
        setTimeout(() => {
          const finalVoices = window.speechSynthesis.getVoices();
          if (finalVoices.length === 0) {
            console.warn("No TTS voices available");
            alert(
              "No text-to-speech voices are available on your system. AI responses will be displayed as text only. This is common on Linux systems - you may need to install speech synthesis voices."
            );
          }
        }, 2000);
      } else {
        console.warn("Speech synthesis not supported in this browser");
        alert(
          "Text-to-speech is not supported in your browser. AI responses will be displayed as text only."
        );
      }
    } catch (error) {
      console.error("Error accessing media:", error);
      alert(
        error.message ||
          "Could not access camera/microphone. Please check permissions and ensure a microphone is connected."
      );
    }
  };

  // Initialize Socket.IO connection
  const initializeSocket = () => {
    const socketConnection = io(
      import.meta.env.VITE_APP_API_URL || "http://localhost:5000"
    );
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Connected to interview server");
      // Don't join immediately - wait for interview to start
    });

    socketConnection.on("interview-joined", (data) => {
      console.log("Joined interview session:", data.session);
      setSession(data.session);
      // Interview is now active
    });

    socketConnection.on("interview-response", (data) => {
      console.log("Received AI response:", data);
      handleAIResponse(data.response, data.session);
    });

    socketConnection.on("interview-error", (data) => {
      console.error("Interview error:", data.message);
      alert(`Interview error: ${data.message}`);
    });

    socketConnection.on("disconnect", () => {
      console.log("Disconnected from interview server");
      setInterviewState("completed");
    });
  };

  // Join interview session via socket (called after interview starts)
  const joinInterviewSession = () => {
    if (socket && user) {
      socket.emit("join-interview", {
        sessionId,
        userId: user._id,
      });
    }
  };

  // Load interview session data
  const loadSession = async () => {
    try {
      const response = await axios.get(`/interviews/${sessionId}`);
      if (response.data.success) {
        const sessionData = response.data.data;
        setSession(sessionData);

        // Set initial state based on session status
        if (sessionData.status === "setup") {
          setInterviewState("setup");
        } else if (sessionData.status === "active") {
          setInterviewState("active");
          // If session is already active, join immediately
          joinInterviewSession();
        } else if (sessionData.status === "completed") {
          setInterviewState("completed");
        }
      }
    } catch (error) {
      console.error("Error loading session:", error);
      navigate("/dashboard");
    }
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.warn("Speech recognition not supported");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("[Speech Recognition] Started - listening for speech...");
      setIsListening(true);
      setLiveSpeechText(""); // Clear previous text when starting
    };

    recognition.onaudiostart = () => {
      console.log("[Speech Recognition] Audio capturing started");
    };

    recognition.onsoundstart = () => {
      console.log("[Speech Recognition] Sound detected");
    };

    recognition.onspeechstart = () => {
      console.log("[Speech Recognition] Speech detected - user is speaking");
    };

    recognition.onspeechend = () => {
      console.log("[Speech Recognition] Speech ended - user stopped speaking");
    };

    recognition.onsoundend = () => {
      console.log("[Speech Recognition] Sound ended");
    };

    recognition.onaudioend = () => {
      console.log("[Speech Recognition] Audio capturing ended");
    };

    recognition.onresult = (event) => {
      console.log("[Speech Recognition] Result event received:", event);
      
      // Build the full transcript from all results
      let interimTranscript = "";
      let finalTranscript = "";
      
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += transcript + " ";
          console.log("[Speech Recognition] Final transcript:", transcript);
          console.log("[Speech Recognition] Confidence:", result[0].confidence);
        } else {
          interimTranscript += transcript;
          console.log("[Speech Recognition] Interim transcript:", transcript);
        }
      }
      
      // Update live speech text for UI display
      const displayText = finalTranscript + interimTranscript;
      setLiveSpeechText(displayText);
      console.log("[Speech Recognition] Live display:", displayText);
      
      // Only send final results to the server
      if (finalTranscript.trim()) {
        handleSpeechInput(finalTranscript.trim());
      }
    };

    recognition.onnomatch = (event) => {
      console.warn("[Speech Recognition] No match - speech was detected but could not be recognized:", event);
    };

    recognition.onerror = (event) => {
      console.error("[Speech Recognition] Error occurred:", event.error);
      console.error("[Speech Recognition] Error message:", event.message);
      console.error("[Speech Recognition] Full error event:", event);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("[Speech Recognition] Session ended");
      setIsListening(false);
    };

    setSpeechRecognition(recognition);
    recognitionRef.current = recognition;
  };

  // Handle user speech input
  const handleSpeechInput = async (speechText) => {
    if (!socket || !session) return;

    try {
      socket.emit("interview-speech", {
        speechText,
        questionId: currentQuestion?.questionId,
      });
    } catch (error) {
      console.error("Error sending speech:", error);
    }
  };

  // Handle AI response
  const handleAIResponse = async (response, updatedSession) => {
    setAiResponse(response.text);
    setFeedback(response.feedback || "");
    setSession(updatedSession);

    // Update current question if provided
    if (response.questionId) {
      const question = updatedSession.questions.find(
        (q) => q.questionId === response.questionId
      );
      if (question) {
        setCurrentQuestion(question);
      }
    }

    // Update transcript
    setTranscript(updatedSession.transcript || []);

    // Speak the AI response
    if (response.text && speechSynthesis) {
      speakText(response.text);
    }
  };

  // Text-to-speech function
  const speakText = (text) => {
    console.log("speakText called with:", text);

    if (!speechSynthesis) {
      console.warn("speechSynthesis not available");
      return;
    }

    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 0.8;

      console.log("Created utterance:", utterance);

      utterance.onstart = () => {
        console.log("TTS started");
        setIsAISpeaking(true);
      };

      utterance.onend = () => {
        console.log("TTS ended");
        setIsAISpeaking(false);
      };

      utterance.onerror = (error) => {
        console.error("Speech synthesis error:", error);
        setIsAISpeaking(false);
      };

      console.log("Calling speechSynthesis.speak()");
      speechSynthesis.speak(utterance);
      console.log("speechSynthesis.speak() called successfully");
    } catch (error) {
      console.error("Error in speakText:", error);
    }
  };

  // Start interview
  const startInterview = async () => {
    try {
      const response = await axios.put(`/interviews/${sessionId}/start`);
      if (response.data.success) {
        setSession(response.data.data);
        setInterviewState("active");

        // Join the interview session via socket now that it's active
        // Server will automatically send welcome message
        joinInterviewSession();
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start interview. Please try again.");
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  // Start/stop listening
  const toggleListening = () => {
    if (!speechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  // End interview
  const endInterview = async () => {
    try {
      if (socket) {
        socket.emit("leave-interview");
      }

      const response = await axios.put(`/interviews/${sessionId}/end`, {
        feedback: {
          strengths: ["Good communication skills"],
          improvements: ["Could elaborate more on technical details"],
          overallAssessment: "Solid performance with room for improvement",
        },
      });

      if (response.data.success) {
        setInterviewState("completed");
        setTimeout(() => {
          navigate(`/interview-results/${sessionId}`);
        }, 3000);
      }
    } catch (error) {
      console.error("Error ending interview:", error);
      navigate("/dashboard");
    }
  };

  // Cleanup function
  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (socket) {
      socket.disconnect();
    }
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Header */}
      <div className="bg-base-100 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-base-content">
              AI Interview Practice
            </h1>
            <p className="text-sm text-base-content/70">
              Session: {sessionId?.slice(-8)}
            </p>
          </div>
          <button onClick={endInterview} className="btn btn-ghost btn-sm">
            End Interview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {interviewState === "connecting" && (
          <div className="text-center space-y-6">
            <div className="animate-pulse">
              <div className="w-32 h-32 bg-info rounded-full mx-auto flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-info-content"></span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Connecting to Interview...
              </h2>
              <p className="text-base-content/70">
                Setting up your AI interview session
              </p>
            </div>
          </div>
        )}

        {interviewState === "setup" && (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-primary rounded-full mx-auto flex items-center justify-center">
              <FaVideo className="text-4xl text-primary-content" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Ready to Begin
              </h2>
              <p className="text-base-content/70 mb-4">
                Your AI interviewer is ready. Click start when you're prepared.
              </p>
              <button
                onClick={startInterview}
                className="btn btn-primary btn-lg"
              >
                <FaPlay className="mr-2" />
                Start Interview
              </button>
            </div>
          </div>
        )}

        {(interviewState === "active" || interviewState === "paused") && (
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* AI Interviewer Side */}
              <div className="relative bg-base-100 rounded-lg overflow-hidden shadow-lg">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center mb-4">
                      <span className="text-3xl">🤖</span>
                    </div>
                    <h3 className="text-lg font-semibold text-base-content mb-2">
                      AI Interviewer
                    </h3>
                    {isAISpeaking && (
                      <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Response Text */}
                <div className="p-4 bg-base-100 border-t">
                  <p className="text-sm text-base-content/80 min-h-[3rem]">
                    {aiResponse || "Waiting for your response..."}
                  </p>
                </div>
              </div>

              {/* User Side */}
              <div className="relative bg-base-100 rounded-lg overflow-hidden shadow-lg">
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  You {isListening && "(Listening)"}
                </div>
                
                {/* Live Speech Display */}
                <div className="p-4 bg-base-100 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-base-content/70">Your Speech:</span>
                    {isListening && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                        <span className="text-xs text-success">Listening...</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-base-content min-h-[3rem] italic">
                    {liveSpeechText || (isListening ? "Start speaking..." : "Click the microphone button to speak")}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Question */}
            {currentQuestion && (
              <div className="card bg-base-100 shadow-lg mb-4">
                <div className="card-body">
                  <h3 className="card-title text-lg">Current Question</h3>
                  <p className="text-base-content">
                    {currentQuestion.question}
                  </p>
                  {feedback && (
                    <div className="alert alert-info mt-4">
                      <span>{feedback}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleMic}
                className={`btn btn-circle btn-lg ${
                  !isMicOn ? "btn-error" : "btn-ghost"
                }`}
                title={isMicOn ? "Mute microphone" : "Unmute microphone"}
              >
                {isMicOn ? (
                  <FaMicrophone className="text-xl" />
                ) : (
                  <FaMicrophoneSlash className="text-xl" />
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`btn btn-circle btn-lg ${
                  !isVideoOn ? "btn-error" : "btn-ghost"
                }`}
                title={isVideoOn ? "Turn off camera" : "Turn on camera"}
              >
                {isVideoOn ? (
                  <FaVideo className="text-xl" />
                ) : (
                  <FaVideoSlash className="text-xl" />
                )}
              </button>

              <button
                onClick={toggleListening}
                className={`btn btn-circle btn-lg ${
                  isListening ? "btn-success" : "btn-ghost"
                }`}
                title={isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? (
                  <FaPause className="text-xl" />
                ) : (
                  <FaMicrophone className="text-xl" />
                )}
              </button>

              <button
                onClick={endInterview}
                className="btn btn-circle btn-lg btn-error"
                title="End interview"
              >
                <FaPhoneSlash className="text-xl" />
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 text-center">
              <p className="text-sm text-base-content/70">
                Click the microphone button to start speaking, or use voice
                activation
              </p>
            </div>
          </div>
        )}

        {interviewState === "completed" && (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-success rounded-full mx-auto flex items-center justify-center">
              <FaRedo className="text-4xl text-success-content" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Interview Completed
              </h2>
              <p className="text-base-content/70">
                Great job! Generating your assessment...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRoom;
