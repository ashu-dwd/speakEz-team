import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "../utils/axios";
import Layout from "../components/common/Layout";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showRoomSettings, setShowRoomSettings] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get user info from localStorage (assuming it's stored there)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
      initializeSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const newSocket = io(
      import.meta.env.VITE_APP_API_URL || "http://localhost:3000"
    );

    newSocket.on("connect", () => {
      setIsConnected(true);
      // Join the chat room
      newSocket.emit("join-chat-room", { roomId, userId: user.id });
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("chat-room-joined", (data) => {
      console.log("Joined chat room:", data.roomId);
    });

    newSocket.on("chat-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on("user-joined", (data) => {
      // Add system message for user joining
      const systemMessage = {
        id: `system-${Date.now()}`,
        content: `${data.userId} joined the room`,
        messageType: "system",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    newSocket.on("user-left", (data) => {
      // Add system message for user leaving
      const systemMessage = {
        id: `system-${Date.now()}`,
        content: `${data.userId} left the room`,
        messageType: "system",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    newSocket.on("chat-error", (error) => {
      console.error("Chat error:", error.message);
      setError(error.message);
    });

    newSocket.on("user-typing", (data) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    });

    setSocket(newSocket);
  };

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const [roomResponse, messagesResponse] = await Promise.all([
        axios.get(`/chat-rooms/rooms/${roomId}`),
        axios.get(`/chat-rooms/rooms/${roomId}/messages?limit=50`),
      ]);

      setRoom(roomResponse.data.room);
      setMessages(messagesResponse.data.messages);
      setError(null);
    } catch (err) {
      setError("Failed to load room");
      console.error("Error fetching room:", err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !isConnected) return;

    // Stop typing indicator
    if (socket) {
      socket.emit("stop-typing");
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit("send-chat-message", { content: newMessage.trim() });
    setNewMessage("");
    messageInputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!socket || !isConnected) return;

    // Start typing indicator
    if (value.trim() && !typingTimeoutRef.current) {
      socket.emit("start-typing");
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit("stop-typing");
      }
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const handleLeaveRoom = async () => {
    try {
      await axios.post(`/chat-rooms/rooms/${roomId}/leave`);
      if (socket) {
        socket.emit("leave-chat-room");
      }
      navigate("/chat-rooms");
    } catch (err) {
      console.error("Error leaving room:", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const MessageBubble = ({ message }) => {
    const isOwnMessage = message.sender?._id === user.id;
    const isSystemMessage = message.messageType === "system";

    if (isSystemMessage) {
      return (
        <div className="flex justify-center my-2">
          <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`flex mb-4 ${
          isOwnMessage ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-900"
          }`}
        >
          {!isOwnMessage && (
            <div className="text-xs font-semibold mb-1 text-gray-600">
              {message.sender?.username}
            </div>
          )}
          <div className="text-sm">{message.content}</div>
          <div
            className={`text-xs mt-1 ${
              isOwnMessage ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    );
  };

  const RoomSettingsModal = ({ isOpen, onClose }) => {
    const [settings, setSettings] = useState({
      name: room?.name || "",
      description: room?.description || "",
      maxParticipants: room?.maxParticipants || 50,
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
      try {
        setSaving(true);
        await axios.put(`/chat-rooms/rooms/${roomId}`, settings);
        setRoom((prev) => ({ ...prev, ...settings }));
        onClose();
      } catch (err) {
        console.error("Error updating room:", err);
      } finally {
        setSaving(false);
      }
    };

    const handleDelete = async () => {
      if (
        !window.confirm(
          "Are you sure you want to delete this room? This action cannot be undone."
        )
      ) {
        return;
      }

      try {
        await axios.delete(`/chat-rooms/rooms/${roomId}`);
        navigate("/chat-rooms");
      } catch (err) {
        console.error("Error deleting room:", err);
      }
    };

    if (!isOpen || !room) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-bold mb-4">Room Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input input-bordered w-full"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={settings.description}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="textarea textarea-bordered w-full"
                maxLength={200}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                value={settings.maxParticipants}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maxParticipants: Math.max(
                      2,
                      Math.min(100, parseInt(e.target.value) || 50)
                    ),
                  }))
                }
                className="input input-bordered w-full"
                min={2}
                max={100}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="btn btn-ghost flex-1"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary flex-1"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {room.canManage && (
              <div className="pt-4 border-t">
                <button
                  onClick={handleDelete}
                  className="btn btn-error btn-sm w-full"
                >
                  Delete Room
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </Layout>
    );
  }

  if (error || !room) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error || "Room not found"}</div>
            <button
              onClick={() => navigate("/chat-rooms")}
              className="btn btn-primary"
            >
              Back to Rooms
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/chat-rooms")}
              className="btn btn-ghost btn-sm"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {room.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FaUsers />
                  {room.participantCount}/{room.maxParticipants}
                </span>
                {!isConnected && (
                  <span className="text-red-500">Disconnected</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {room.canManage && (
              <button
                onClick={() => setShowRoomSettings(true)}
                className="btn btn-ghost btn-sm"
                title="Room Settings"
              >
                <FaCog />
              </button>
            )}
            <button
              onClick={handleLeaveRoom}
              className="btn btn-ghost btn-sm text-red-500"
              title="Leave Room"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  No messages yet. Be the first to say something!
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="bg-white border-t border-gray-200 px-4 py-2">
            <div className="max-w-4xl mx-auto">
              <div className="text-sm text-gray-500 italic">
                {Array.from(typingUsers).filter((id) => id !== user.id).length >
                0
                  ? `${
                      Array.from(typingUsers).filter((id) => id !== user.id)
                        .length
                    } user${
                      Array.from(typingUsers).filter((id) => id !== user.id)
                        .length > 1
                        ? "s are"
                        : " is"
                    } typing...`
                  : "Someone is typing..."}
              </div>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                ref={messageInputRef}
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                placeholder={
                  isConnected ? "Type a message..." : "Connecting..."
                }
                className="input input-bordered flex-1"
                maxLength={1000}
                disabled={!isConnected}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!newMessage.trim() || !isConnected}
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>

        <RoomSettingsModal
          isOpen={showRoomSettings}
          onClose={() => setShowRoomSettings(false)}
        />
      </div>
    </Layout>
  );
};

export default ChatRoom;
