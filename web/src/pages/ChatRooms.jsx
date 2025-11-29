import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import Layout from "../components/common/Layout";
import { FaPlus, FaUsers, FaLock, FaGlobe, FaComments } from "react-icons/fa";

const ChatRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinErrors, setJoinErrors] = useState({});
  const navigate = useNavigate();

  // Get user info from localStorage (same as ChatRoom.jsx)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/chat-rooms/rooms");
      setRooms(response.data.rooms);
      setError(null);
    } catch (err) {
      setError("Failed to load chat rooms");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      // Clear any previous error for this room
      setJoinErrors((prev) => ({ ...prev, [roomId]: null }));
      await axios.post(`/chat-rooms/rooms/${roomId}/join`);
      navigate(`/chat-rooms/${roomId}`);
    } catch (err) {
      console.error("Error joining room:", err);
      const errorMessage = err.response?.data?.message || "Failed to join room";
      setJoinErrors((prev) => ({ ...prev, [roomId]: errorMessage }));
    }
  };

  const handleEnterRoom = (roomId) => {
    navigate(`/chat-rooms/${roomId}`);
  };

  const RoomCard = ({ room }) => {
    const joinError = joinErrors[room.id];

    // Check if user is already a participant
    const isUserParticipant =
      user.id &&
      room.participants?.some((participant) => participant._id === user.id);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {room.name}
              </h3>
              {room.isPublic ? (
                <FaGlobe
                  className="text-green-500 text-sm"
                  title="Public room"
                />
              ) : (
                <FaLock
                  className="text-orange-500 text-sm"
                  title="Private room"
                />
              )}
            </div>
            {room.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {room.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FaUsers className="text-gray-400" />
              <span>
                {room.participantCount}/{room.maxParticipants}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FaComments className="text-gray-400" />
              <span>{room.messageCount}</span>
            </div>
          </div>

          <button
            onClick={() =>
              isUserParticipant
                ? handleEnterRoom(room.id)
                : handleJoinRoom(room.id)
            }
            className="btn btn-primary btn-sm"
            disabled={room.participantCount >= room.maxParticipants}
          >
            {room.participantCount >= room.maxParticipants
              ? "Full"
              : isUserParticipant
              ? "Enter Room"
              : "Join"}
          </button>
        </div>

        {joinError && (
          <div className="mt-3 text-xs text-red-500">{joinError}</div>
        )}

        <div className="mt-3 text-xs text-gray-400">
          Created by {room.creator?.username || "Unknown User"}
        </div>
      </div>
    );
  };

  const CreateRoomModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      isPublic: true,
      maxParticipants: 50,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setSubmitting(true);
        const response = await axios.post("/chat-rooms/rooms", formData);
        setRooms((prev) => [response.data.room, ...prev]);
        setShowCreateModal(false);
        setFormData({
          name: "",
          description: "",
          isPublic: true,
          maxParticipants: 50,
        });
        navigate(`/chat-rooms/${response.data.room.id}`);
      } catch (err) {
        console.error("Error creating room:", err);
        // Could show error toast
      } finally {
        setSubmitting(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-bold mb-4">Create Chat Room</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input input-bordered w-full"
                placeholder="Enter room name"
                maxLength={50}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="textarea textarea-bordered w-full"
                placeholder="Optional description"
                maxLength={200}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="privacy"
                    checked={formData.isPublic}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, isPublic: true }))
                    }
                    className="radio radio-primary"
                  />
                  <span className="text-sm">Public</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!formData.isPublic}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, isPublic: false }))
                    }
                    className="radio radio-primary"
                  />
                  <span className="text-sm">Private</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) =>
                  setFormData((prev) => ({
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
                type="button"
                onClick={onClose}
                className="btn btn-ghost flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={submitting || !formData.name.trim()}
              >
                {submitting ? "Creating..." : "Create Room"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button onClick={fetchRooms} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chat Rooms</h1>
          <p className="text-gray-600 mt-2">
            Join existing rooms or create your own to chat with other learners
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary gap-2"
        >
          <FaPlus />
          Create Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12">
          <FaComments className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No chat rooms yet
          </h3>
          <p className="text-gray-500 mb-6">
            Be the first to create a room and start chatting!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create Your First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}

      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default ChatRooms;
