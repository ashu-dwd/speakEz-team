import express from "express";
import ChatRoom from "../models/chatRoom.js";
import ChatMessage from "../models/chatMessage.js";
import verifyToken from "../middlewares/auth.js";

const Router = express.Router();

// Apply authentication to all chat routes
Router.use(verifyToken);

// Get all rooms (public rooms + user's private rooms)
Router.get("/rooms", async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get public rooms and rooms where user is a participant
    const rooms = await ChatRoom.find({
      $or: [{ isPublic: true }, { participants: userId }, { creator: userId }],
      isActive: true,
    })
      .populate("creator", "username avatar")
      .populate("participants", "username avatar")
      .sort({ lastActivity: -1 })
      .limit(50);

    res.json({
      success: true,
      rooms: rooms.map((room) => ({
        id: room._id,
        name: room.name,
        description: room.description,
        creator: room.creator,
        isPublic: room.isPublic,
        participants: room.participants,
        participantCount: room.participants.length,
        maxParticipants: room.maxParticipants,
        lastActivity: room.lastActivity,
        messageCount: room.messageCount,
        createdAt: room.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
});

// Create a new room
Router.post("/rooms", async (req, res) => {
  try {
    const {
      name,
      description,
      isPublic = true,
      maxParticipants = 50,
    } = req.body;
    const userId = req.user.userId;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Room name is required",
      });
    }

    if (name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Room name must be 50 characters or less",
      });
    }

    const room = new ChatRoom({
      name: name.trim(),
      description: description?.trim(),
      creator: userId,
      isPublic,
      participants: [userId], // Creator is automatically a participant
      maxParticipants,
    });

    await room.save();

    // Populate creator info
    await room.populate("creator", "username avatar");
    await room.populate("participants", "username avatar");

    res.status(201).json({
      success: true,
      room: {
        id: room._id,
        name: room.name,
        description: room.description,
        creator: room.creator,
        isPublic: room.isPublic,
        participants: room.participants,
        participantCount: room.participants.length,
        maxParticipants: room.maxParticipants,
        lastActivity: room.lastActivity,
        messageCount: room.messageCount,
        createdAt: room.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create room",
    });
  }
});

// Get room details
Router.get("/rooms/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;

    const room = await ChatRoom.findOne({
      _id: roomId,
      isActive: true,
      $or: [{ isPublic: true }, { participants: userId }, { creator: userId }],
    })
      .populate("creator", "username avatar")
      .populate("participants", "username avatar");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      room: {
        id: room._id,
        name: room.name,
        description: room.description,
        creator: room.creator,
        isPublic: room.isPublic,
        participants: room.participants,
        participantCount: room.participants.length,
        maxParticipants: room.maxParticipants,
        lastActivity: room.lastActivity,
        messageCount: room.messageCount,
        createdAt: room.createdAt,
        canManage: room.creator._id.toString() === userId,
      },
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room",
    });
  }
});

// Update room
Router.put("/rooms/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name, description, maxParticipants } = req.body;
    const userId = req.user.userId;

    const room = await ChatRoom.findOne({
      _id: roomId,
      creator: userId,
      isActive: true,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found or you don't have permission to edit it",
      });
    }

    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Room name cannot be empty",
        });
      }
      if (name.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Room name must be 50 characters or less",
        });
      }
      room.name = name.trim();
    }

    if (description !== undefined) {
      room.description = description?.trim();
    }

    if (maxParticipants !== undefined) {
      if (maxParticipants < 2 || maxParticipants > 100) {
        return res.status(400).json({
          success: false,
          message: "Max participants must be between 2 and 100",
        });
      }
      room.maxParticipants = maxParticipants;
    }

    await room.save();

    res.json({
      success: true,
      room: {
        id: room._id,
        name: room.name,
        description: room.description,
        maxParticipants: room.maxParticipants,
      },
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update room",
    });
  }
});

// Delete room
Router.delete("/rooms/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;

    const room = await ChatRoom.findOneAndUpdate(
      {
        _id: roomId,
        creator: userId,
        isActive: true,
      },
      { isActive: false },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found or you don't have permission to delete it",
      });
    }

    res.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete room",
    });
  }
});

// Join room
Router.post("/rooms/:roomId/join", async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;

    const room = await ChatRoom.findOne({
      _id: roomId,
      isActive: true,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (!room.isPublic && room.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "This is a private room",
      });
    }

    if (room.participants.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are already in this room",
      });
    }

    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Room is full",
      });
    }

    room.participants.push(userId);
    await room.save();

    res.json({
      success: true,
      message: "Joined room successfully",
    });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({
      success: false,
      message: "Failed to join room",
    });
  }
});

// Leave room
Router.post("/rooms/:roomId/leave", async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;

    const room = await ChatRoom.findOne({
      _id: roomId,
      isActive: true,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const participantIndex = room.participants.indexOf(userId);
    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "You are not in this room",
      });
    }

    // If user is the creator and there are other participants, transfer ownership
    if (room.creator.toString() === userId && room.participants.length > 1) {
      // Find another participant to be the new creator
      const otherParticipants = room.participants.filter(
        (p) => p.toString() !== userId
      );
      room.creator = otherParticipants[0];
    }

    room.participants.splice(participantIndex, 1);

    // If no participants left, mark as inactive
    if (room.participants.length === 0) {
      room.isActive = false;
    }

    await room.save();

    res.json({
      success: true,
      message: "Left room successfully",
    });
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({
      success: false,
      message: "Failed to leave room",
    });
  }
});

// Get room messages
Router.get("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;
    const { limit = 50, before } = req.query;

    // Check if user has access to the room
    const room = await ChatRoom.findOne({
      _id: roomId,
      isActive: true,
      $or: [{ isPublic: true }, { participants: userId }],
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found or access denied",
      });
    }

    let query = { roomId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await ChatMessage.find(query)
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Reverse to get chronological order
    messages.reverse();

    res.json({
      success: true,
      messages: messages.map((msg) => ({
        id: msg._id,
        content: msg.content,
        sender: msg.sender,
        messageType: msg.messageType,
        isEdited: msg.isEdited,
        editedAt: msg.editedAt,
        createdAt: msg.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

export default Router;
