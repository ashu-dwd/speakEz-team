import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
} from "react-icons/fa";

/**
 * Call Page - Video calling interface for public speaking practice
 */
const Call = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [callState, setCallState] = useState("connecting"); // connecting, waiting, matched, active, ended
  const [peerConnection, setPeerConnection] = useState(null);
  const [stream, setStream] = useState(null);
  const [partnerStream, setPartnerStream] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [error, setError] = useState(null);

  const myVideoRef = useRef();
  const partnerVideoRef = useRef();

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

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    const socketConnection = io(
      import.meta.env.VITE_APP_API_URL || "http://localhost:5000"
    );
    setSocket(socketConnection);

    // Join queue when connected
    socketConnection.on("connect", () => {
      socketConnection.emit("join-queue", { userId: user._id });
      setCallState("waiting");
    });

    // Queue events
    socketConnection.on("queue-joined", (data) => {
      setQueuePosition(data.position);
      setCallState("waiting");
    });

    socketConnection.on("queue-error", (data) => {
      setError(data.message);
      setCallState("ended");
    });

    // Match found - initialize WebRTC
    socketConnection.on("match-found", async (data) => {
      setCallState("matched");
      setRoomId(data.roomId);

      try {
        // Get user media
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(mediaStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }

        // Create RTCPeerConnection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        });

        // Add local stream tracks to peer connection
        mediaStream.getTracks().forEach((track) => {
          pc.addTrack(track, mediaStream);
        });

        // Handle remote stream
        pc.ontrack = (event) => {
          setPartnerStream(event.streams[0]);
          if (partnerVideoRef.current) {
            partnerVideoRef.current.srcObject = event.streams[0];
          }
          setCallState("active");
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socketConnection.emit("ice-candidate", {
              targetSocketId: data.partnerSocketId,
              candidate: event.candidate,
            });
          }
        };

        // Create and send offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socketConnection.emit("offer", {
          targetSocketId: data.partnerSocketId,
          offer: pc.localDescription,
        });

        setPeerConnection(pc);
      } catch (err) {
        console.error("Error initializing WebRTC:", err);
        setError("Could not access camera/microphone");
        setCallState("ended");
      }
    });

    // Handle incoming offer
    socketConnection.on("offer", async (data) => {
      try {
        if (!peerConnection) {
          // Create peer connection for receiver
          const pc = new RTCPeerConnection({
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
            ],
          });

          // Get user media for receiver
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          setStream(mediaStream);
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = mediaStream;
          }

          // Add local stream tracks
          mediaStream.getTracks().forEach((track) => {
            pc.addTrack(track, mediaStream);
          });

          // Handle remote stream
          pc.ontrack = (event) => {
            setPartnerStream(event.streams[0]);
            if (partnerVideoRef.current) {
              partnerVideoRef.current.srcObject = event.streams[0];
            }
            setCallState("active");
          };

          // Handle ICE candidates
          pc.onicecandidate = (event) => {
            if (event.candidate) {
              socketConnection.emit("ice-candidate", {
                targetSocketId: data.from,
                candidate: event.candidate,
              });
            }
          };

          setPeerConnection(pc);

          // Set remote description and create answer
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socketConnection.emit("answer", {
            targetSocketId: data.from,
            answer: pc.localDescription,
          });
        }
      } catch (err) {
        console.error("Error handling offer:", err);
        setError("Connection failed");
        setCallState("ended");
      }
    });

    // Handle incoming answer
    socketConnection.on("answer", async (data) => {
      try {
        if (peerConnection) {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        }
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    });

    // Handle ICE candidates
    socketConnection.on("ice-candidate", async (data) => {
      try {
        if (peerConnection && data.candidate) {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        }
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    // Call events
    socketConnection.on("call-ended", () => {
      endCall();
    });

    socketConnection.on("participant-disconnected", () => {
      setError("Partner disconnected");
      endCall();
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [user]);

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  const endCall = () => {
    setCallState("ended");

    // Clean up peer connection
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    // Clean up streams
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    setPartnerStream(null);

    // Notify server
    if (socket && roomId) {
      socket.emit("end-call", { roomId });
    }

    // Redirect after a delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  };

  const leaveQueue = () => {
    if (socket) {
      socket.emit("leave-queue", { userId: user?._id });
    }
    navigate("/dashboard");
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
          <h1 className="text-xl font-bold text-base-content">
            Public Speaking Practice
          </h1>
          <button
            onClick={callState === "waiting" ? leaveQueue : endCall}
            className="btn btn-ghost btn-sm"
          >
            {callState === "waiting" ? "Leave Queue" : "End Call"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {callState === "waiting" && (
          <div className="text-center space-y-6">
            <div className="animate-pulse">
              <div className="w-32 h-32 bg-primary rounded-full mx-auto flex items-center justify-center">
                <FaVideo className="text-4xl text-primary-content" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Finding a Practice Partner
              </h2>
              <p className="text-base-content/70">
                You're #{queuePosition} in the queue. We'll match you with
                someone soon!
              </p>
            </div>
            <div className="flex justify-center space-x-2">
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
          </div>
        )}

        {callState === "matched" && (
          <div className="text-center space-y-6">
            <div className="animate-pulse">
              <div className="w-32 h-32 bg-success rounded-full mx-auto flex items-center justify-center">
                <FaVideo className="text-4xl text-success-content" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Partner Found!
              </h2>
              <p className="text-base-content/70">Connecting you now...</p>
            </div>
          </div>
        )}

        {callState === "active" && (
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* My Video */}
              <div className="relative bg-base-100 rounded-lg overflow-hidden shadow-lg">
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted
                  className="w-full h-64 lg:h-80 object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  You {isMuted && "(Muted)"}
                </div>
              </div>

              {/* Partner Video */}
              <div className="relative bg-base-100 rounded-lg overflow-hidden shadow-lg">
                <video
                  ref={partnerVideoRef}
                  autoPlay
                  className="w-full h-64 lg:h-80 object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  Practice Partner
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleMute}
                className={`btn btn-circle btn-lg ${
                  isMuted ? "btn-error" : "btn-ghost"
                }`}
              >
                {isMuted ? (
                  <FaMicrophoneSlash className="text-xl" />
                ) : (
                  <FaMicrophone className="text-xl" />
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`btn btn-circle btn-lg ${
                  isVideoOff ? "btn-error" : "btn-ghost"
                }`}
              >
                {isVideoOff ? (
                  <FaVideoSlash className="text-xl" />
                ) : (
                  <FaVideo className="text-xl" />
                )}
              </button>

              <button
                onClick={endCall}
                className="btn btn-circle btn-lg btn-error"
              >
                <FaPhoneSlash className="text-xl" />
              </button>
            </div>
          </div>
        )}

        {callState === "ended" && (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-base-100 rounded-full mx-auto flex items-center justify-center">
              <FaPhoneSlash className="text-4xl text-base-content" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Call Ended
              </h2>
              <p className="text-base-content/70">
                {error || "Thanks for practicing! Returning to dashboard..."}
              </p>
            </div>
          </div>
        )}

        {error && callState !== "ended" && (
          <div className="alert alert-error max-w-md">
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Call;
