import { nanoid } from "nanoid";
import CallQueue from "./models/callQueue.js";
import CallRoom from "./models/callRoom.js";

/**
 * Socket.IO event handlers for video calling functionality
 * @param {Server} io - Socket.IO server instance
 */
export const setupSocketHandlers = (io) => {
  // Store active socket connections
  const activeSockets = new Map();

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Store socket reference
    activeSockets.set(socket.id, socket);

    // Handle user joining call queue
    socket.on("join-queue", async (data) => {
      try {
        const { userId, callType = "public_speaking" } = data;

        if (!userId) {
          socket.emit("queue-error", { message: "User ID is required" });
          return;
        }

        // Check if user is already in queue
        const existingQueue = await CallQueue.findOne({ userId });
        if (existingQueue) {
          socket.emit("queue-error", { message: "Already in queue" });
          return;
        }

        // Add user to queue
        const queueEntry = new CallQueue({
          userId,
          socketId: socket.id,
          callType,
        });

        await queueEntry.save();

        socket.emit("queue-joined", {
          message: "Successfully joined queue",
          position: await getQueuePosition(userId),
        });

        // Try to find a match immediately
        await tryMatchUsers(callType);
      } catch (error) {
        console.error("Error joining queue:", error);
        socket.emit("queue-error", { message: "Failed to join queue" });
      }
    });

    // Handle user leaving queue
    socket.on("leave-queue", async (data) => {
      try {
        const { userId } = data;

        await CallQueue.findOneAndDelete({ userId });
        socket.emit("queue-left", { message: "Left queue successfully" });
      } catch (error) {
        console.error("Error leaving queue:", error);
        socket.emit("queue-error", { message: "Failed to leave queue" });
      }
    });

    // Handle WebRTC signaling
    socket.on("offer", (data) => {
      const { targetSocketId, offer } = data;
      const targetSocket = activeSockets.get(targetSocketId);
      if (targetSocket) {
        targetSocket.emit("offer", { from: socket.id, offer });
      }
    });

    socket.on("answer", (data) => {
      const { targetSocketId, answer } = data;
      const targetSocket = activeSockets.get(targetSocketId);
      if (targetSocket) {
        targetSocket.emit("answer", { from: socket.id, answer });
      }
    });

    socket.on("ice-candidate", (data) => {
      const { targetSocketId, candidate } = data;
      const targetSocket = activeSockets.get(targetSocketId);
      if (targetSocket) {
        targetSocket.emit("ice-candidate", { from: socket.id, candidate });
      }
    });

    // Handle call end
    socket.on("end-call", async (data) => {
      try {
        const { roomId } = data;

        const room = await CallRoom.findOne({ roomId });
        if (room) {
          room.status = "ended";
          room.endedAt = new Date();
          if (room.startedAt) {
            room.duration = Math.floor((room.endedAt - room.startedAt) / 1000);
          }
          await room.save();

          // Notify other participant
          const otherParticipant = room.participants.find(
            (p) => p.socketId !== socket.id
          );
          if (otherParticipant) {
            const otherSocket = activeSockets.get(otherParticipant.socketId);
            if (otherSocket) {
              otherSocket.emit("call-ended", { roomId });
            }
          }
        }

        socket.emit("call-ended", { roomId });
      } catch (error) {
        console.error("Error ending call:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.id}`);

      try {
        // Remove from queue if present
        await CallQueue.findOneAndDelete({ socketId: socket.id });

        // Handle active call cleanup
        const activeRoom = await CallRoom.findOne({
          "participants.socketId": socket.id,
          status: { $in: ["waiting", "connecting", "active"] },
        });

        if (activeRoom) {
          // Mark participant as inactive
          const participant = activeRoom.participants.find(
            (p) => p.socketId === socket.id
          );
          if (participant) {
            participant.isActive = false;
          }

          // Check if both participants are inactive
          const activeParticipants = activeRoom.participants.filter(
            (p) => p.isActive
          );
          if (activeParticipants.length === 0) {
            activeRoom.status = "ended";
            activeRoom.endedAt = new Date();
            if (activeRoom.startedAt) {
              activeRoom.duration = Math.floor(
                (activeRoom.endedAt - activeRoom.startedAt) / 1000
              );
            }
          }

          await activeRoom.save();

          // Notify other participant
          const otherParticipant = activeRoom.participants.find(
            (p) => p.socketId !== socket.id && p.isActive
          );
          if (otherParticipant) {
            const otherSocket = activeSockets.get(otherParticipant.socketId);
            if (otherSocket) {
              otherSocket.emit("participant-disconnected", {
                roomId: activeRoom.roomId,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }

      activeSockets.delete(socket.id);
    });
  });

  /**
   * Try to match users in the queue
   */
  const tryMatchUsers = async (callType) => {
    try {
      const waitingUsers = await CallQueue.find({
        callType,
        status: "waiting",
      })
        .sort({ joinedAt: 1 })
        .limit(2);

      if (waitingUsers.length >= 2) {
        const [user1, user2] = waitingUsers;

        // Update queue status
        await CallQueue.updateMany(
          { _id: { $in: [user1._id, user2._id] } },
          { status: "matched" }
        );

        // Create call room
        const roomId = nanoid(10);
        const callRoom = new CallRoom({
          roomId,
          participants: [
            {
              userId: user1.userId,
              socketId: user1.socketId,
            },
            {
              userId: user2.userId,
              socketId: user2.socketId,
            },
          ],
          status: "connecting",
        });

        await callRoom.save();

        // Notify both users
        const socket1 = activeSockets.get(user1.socketId);
        const socket2 = activeSockets.get(user2.socketId);

        if (socket1 && socket2) {
          socket1.emit("match-found", {
            roomId,
            partnerSocketId: user2.socketId,
            partnerUserId: user2.userId,
          });

          socket2.emit("match-found", {
            roomId,
            partnerSocketId: user1.socketId,
            partnerUserId: user1.userId,
          });

          // Update room status to active
          callRoom.status = "active";
          callRoom.startedAt = new Date();
          await callRoom.save();
        }

        // Remove from queue
        await CallQueue.deleteMany({ _id: { $in: [user1._id, user2._id] } });
      }
    } catch (error) {
      console.error("Error matching users:", error);
    }
  };

  /**
   * Get user's position in queue
   */
  const getQueuePosition = async (userId) => {
    try {
      const userQueue = await CallQueue.findOne({ userId });
      if (!userQueue) return 0;

      const position = await CallQueue.countDocuments({
        callType: userQueue.callType,
        joinedAt: { $lt: userQueue.joinedAt },
      });

      return position + 1;
    } catch (error) {
      console.error("Error getting queue position:", error);
      return 0;
    }
  };
};
