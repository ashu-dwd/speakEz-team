import { nanoid } from "nanoid";
import CallQueue from "./models/callQueue.js";
import CallRoom from "./models/callRoom.js";
import InterviewSession from "./models/interviewSession.js";
import InterviewPreferences from "./models/interviewPreferences.js";
import ChatRoom from "./models/chatRoom.js";
import ChatMessage from "./models/chatMessage.js";

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

          // Create session records for both participants
          const Session = (await import("./models/session.js")).default;
          for (const participant of room.participants) {
            try {
              // Calculate score based on duration (simple scoring for now)
              const baseScore = Math.min(
                100,
                Math.max(50, (room.duration / 60) * 10)
              ); // 1 point per minute, max 100

              const session = await Session.create({
                userId: participant.userId,
                sessionType: "public_speaking",
                topic: "Video Call Practice Session",
                duration: room.duration,
                score: Math.round(baseScore),
                roomId: room.roomId,
                startedAt: room.startedAt,
                completedAt: room.endedAt,
                isCompleted: true,
                metrics: {
                  fluencyScore: Math.round(baseScore),
                  clarityScore: Math.round(baseScore),
                  paceScore: Math.round(baseScore),
                  confidenceScore: Math.round(baseScore),
                  fillerWordsCount: 0, // Not tracked for video calls
                },
                transcript: [], // No transcript for video calls
              });

              console.log(
                `Created session record for user ${participant.userId}: ${session._id}`
              );
            } catch (sessionError) {
              console.error(
                `Error creating session for user ${participant.userId}:`,
                sessionError
              );
            }
          }

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

    // Interview session handlers
    socket.on("join-interview", async (data) => {
      try {
        const { sessionId, userId } = data;

        if (!sessionId || !userId) {
          socket.emit("interview-error", {
            message: "Session ID and User ID are required",
          });
          return;
        }

        const session = await InterviewSession.findOne({ sessionId, userId });
        if (!session) {
          socket.emit("interview-error", {
            message: "Interview session not found",
          });
          return;
        }

        if (session.status !== "active") {
          socket.emit("interview-error", {
            message: "Interview session is not active",
          });
          return;
        }

        // Store interview session info in socket
        socket.interviewSessionId = sessionId;
        socket.userId = userId;

        socket.emit("interview-joined", {
          message: "Successfully joined interview",
          session: session,
        });

        console.log(`User ${userId} joined interview session ${sessionId}`);

        // Send automatic welcome message if this is a fresh interview
        if (session.questions.length === 0 && session.transcript.length === 0) {
          const welcomeResponse = await generateInterviewResponse(session, `START THE INTERVIEW SESSION AND user prefs: ${JSON.stringify(session.preferences)}`);

          // Add welcome to transcript
          session.transcript.push({
            timestamp: new Date(),
            speaker: "ai",
            text: welcomeResponse.text,
            audioUrl: welcomeResponse.audioUrl,
          });

          await session.save();

          // Send welcome message to client
          socket.emit("interview-response", {
            response: welcomeResponse,
            session: session,
          });

          console.log(
            `Sent automatic welcome to user ${userId} in session ${sessionId}`
          );
        }
      } catch (error) {
        console.error("Error joining interview:", error);
        socket.emit("interview-error", { message: "Failed to join interview" });
      }
    });

    socket.on("interview-speech", async (data) => {
      try {
        const { speechText, questionId } = data;
        const sessionId = socket.interviewSessionId;
        const userId = socket.userId;

        if (!sessionId || !userId) {
          socket.emit("interview-error", {
            message: "Not in an active interview session",
          });
          return;
        }

        const session = await InterviewSession.findOne({ sessionId, userId });
        if (!session || session.status !== "active") {
          socket.emit("interview-error", {
            message: "Interview session not active",
          });
          return;
        }

        // Add user speech to transcript
        session.transcript.push({
          timestamp: new Date(),
          speaker: "user",
          text: speechText,
        });

        // Update question response if questionId provided
        if (questionId) {
          const question = session.questions.find(
            (q) => q.questionId === questionId
          );
          if (question) {
            question.userResponse = speechText;
          }
        }

        await session.save();

        // Generate AI response
        const aiResponse = await generateInterviewResponse(session, speechText);

        // Add AI response to transcript
        session.transcript.push({
          timestamp: new Date(),
          speaker: "ai",
          text: aiResponse.text,
          audioUrl: aiResponse.audioUrl,
        });

        await session.save();

        // Send response back to client
        socket.emit("interview-response", {
          response: aiResponse,
          session: session,
        });
      } catch (error) {
        console.error("Error processing interview speech:", error);
        socket.emit("interview-error", { message: "Failed to process speech" });
      }
    });

    socket.on("leave-interview", async () => {
      try {
        const sessionId = socket.interviewSessionId;
        const userId = socket.userId;

        if (sessionId && userId) {
          console.log(`User ${userId} left interview session ${sessionId}`);
        }

        // Clear interview session info
        socket.interviewSessionId = null;
        socket.userId = null;

        socket.emit("interview-left", {
          message: "Left interview successfully",
        });
      } catch (error) {
        console.error("Error leaving interview:", error);
        socket.emit("interview-error", {
          message: "Failed to leave interview",
        });
      }
    });

    // Chat room handlers
    socket.on("join-chat-room", async (data) => {
      try {
        const { roomId, userId } = data;

        if (!roomId || !userId) {
          socket.emit("chat-error", {
            message: "Room ID and User ID are required",
          });
          return;
        }

        // Check if room exists and user has access
        const room = await ChatRoom.findOne({
          _id: roomId,
          isActive: true,
          $or: [{ isPublic: true }, { participants: userId }],
        });

        if (!room) {
          socket.emit("chat-error", {
            message: "Room not found or access denied",
          });
          return;
        }

        // Join the socket room
        socket.join(`chat-room-${roomId}`);

        // Store room info in socket
        socket.chatRoomId = roomId;
        socket.userId = userId;

        // Update room activity
        room.lastActivity = new Date();
        await room.save();

        // Notify others in the room
        socket.to(`chat-room-${roomId}`).emit("user-joined", {
          userId,
          roomId,
        });

        socket.emit("chat-room-joined", {
          message: "Successfully joined chat room",
          roomId,
        });

        console.log(`User ${userId} joined chat room ${roomId}`);
      } catch (error) {
        console.error("Error joining chat room:", error);
        socket.emit("chat-error", { message: "Failed to join chat room" });
      }
    });

    socket.on("leave-chat-room", async () => {
      try {
        const roomId = socket.chatRoomId;
        const userId = socket.userId;

        if (roomId && userId) {
          // Leave the socket room
          socket.leave(`chat-room-${roomId}`);

          // Notify others in the room
          socket.to(`chat-room-${roomId}`).emit("user-left", {
            userId,
            roomId,
          });

          console.log(`User ${userId} left chat room ${roomId}`);
        }

        // Clear room info
        socket.chatRoomId = null;
        socket.userId = null;

        socket.emit("chat-room-left", {
          message: "Left chat room successfully",
        });
      } catch (error) {
        console.error("Error leaving chat room:", error);
        socket.emit("chat-error", {
          message: "Failed to leave chat room",
        });
      }
    });

    socket.on("send-chat-message", async (data) => {
      try {
        const { content } = data;
        const roomId = socket.chatRoomId;
        const userId = socket.userId;

        if (!roomId || !userId) {
          socket.emit("chat-error", {
            message: "Not in a chat room",
          });
          return;
        }

        if (!content || content.trim().length === 0) {
          socket.emit("chat-error", {
            message: "Message content is required",
          });
          return;
        }

        if (content.length > 1000) {
          socket.emit("chat-error", {
            message: "Message too long (max 1000 characters)",
          });
          return;
        }

        // Verify user is still in the room
        const room = await ChatRoom.findOne({
          _id: roomId,
          isActive: true,
          participants: userId,
        });

        if (!room) {
          socket.emit("chat-error", {
            message: "Room not found or you are not a participant",
          });
          return;
        }

        // Create message
        const message = new ChatMessage({
          roomId,
          sender: userId,
          content: content.trim(),
          messageType: "text",
        });

        await message.save();

        // Update room activity and message count
        room.lastActivity = new Date();
        room.messageCount += 1;
        await room.save();

        // Populate sender info
        await message.populate("sender", "username avatar");

        // Broadcast message to all participants in the room
        io.to(`chat-room-${roomId}`).emit("chat-message", {
          id: message._id,
          content: message.content,
          sender: message.sender,
          messageType: message.messageType,
          createdAt: message.createdAt,
        });

        console.log(`Message sent in room ${roomId} by user ${userId}`);
      } catch (error) {
        console.error("Error sending chat message:", error);
        socket.emit("chat-error", { message: "Failed to send message" });
      }
    });

    // Typing indicators
    socket.on("start-typing", async (data) => {
      try {
        const roomId = socket.chatRoomId;
        const userId = socket.userId;

        if (!roomId || !userId) return;

        // Broadcast typing start to other participants
        socket.to(`chat-room-${roomId}`).emit("user-typing", {
          userId,
          isTyping: true,
        });
      } catch (error) {
        console.error("Error handling typing start:", error);
      }
    });

    socket.on("stop-typing", async (data) => {
      try {
        const roomId = socket.chatRoomId;
        const userId = socket.userId;

        if (!roomId || !userId) return;

        // Broadcast typing stop to other participants
        socket.to(`chat-room-${roomId}`).emit("user-typing", {
          userId,
          isTyping: false,
        });
      } catch (error) {
        console.error("Error handling typing stop:", error);
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

        // Handle interview session cleanup
        if (socket.interviewSessionId && socket.userId) {
          console.log(
            `Cleaning up interview session ${socket.interviewSessionId} for disconnected user ${socket.userId}`
          );
          // Interview session cleanup is handled by the client calling leave-interview or end session
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
      console.log(`Trying to match users for callType: ${callType}`);

      const waitingUsers = await CallQueue.find({
        callType,
        status: "waiting",
      })
        .sort({ joinedAt: 1 })
        .limit(2);

      console.log(`Found ${waitingUsers.length} waiting users`);

      if (waitingUsers.length >= 2) {
        const [user1, user2] = waitingUsers;

        console.log(`Matching users: ${user1.userId} with ${user2.userId}`);

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
        console.log(`Created room: ${roomId}`);

        // Notify both users
        const socket1 = activeSockets.get(user1.socketId);
        const socket2 = activeSockets.get(user2.socketId);

        console.log(
          `Socket1 exists: ${!!socket1}, Socket2 exists: ${!!socket2}`
        );

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

          console.log(`Sent match notifications for room: ${roomId}`);

          // Update room status to active
          callRoom.status = "active";
          callRoom.startedAt = new Date();
          await callRoom.save();
        } else {
          console.log("One or both sockets not found, cleaning up...");
          // Clean up if sockets don't exist
          await CallRoom.findByIdAndDelete(callRoom._id);
          await CallQueue.updateMany(
            { _id: { $in: [user1._id, user2._id] } },
            { status: "waiting" }
          );
        }

        // Remove from queue
        await CallQueue.deleteMany({ _id: { $in: [user1._id, user2._id] } });
        console.log("Removed matched users from queue");
      } else {
        console.log("Not enough users to match");
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

  /**
   * Generate AI response for interview using Gemini Service
   */
  const generateInterviewResponse = async (session, userInput) => {
    try {
      console.log("Generating interview response for session:", session);
      console.log("User input:", userInput);
      // Import Gemini service
      const geminiService = (await import("./services/gemini.service.js"))
        .default;

      // Prepare conversation history for context
      const conversationHistory = session.transcript
        .map((entry) => ({
          role: entry.speaker === "user" ? "user" : "assistant",
          content: entry.text,
        }));

      const preferences = session.preferences;
      const focusAreas = preferences.focusAreas || [];
      const questionsAsked = session.questions.length;

      // Determine the category for the next question
      let category = "introduction";
      let instruction = "";

      if (questionsAsked === 0) {
        // First question - welcome and introduction
        category = "introduction";
        instruction = `This is the very first message to the candidate. Welcome them warmly and ask them to introduce themselves. Mention the role (${preferences.jobType}) and ask about their background and experience.`;
      } else if (questionsAsked < 3 && focusAreas.includes("technical_skills")) {
        // Technical questions
        category = "technical";
        instruction = `Ask a ${preferences.difficulty} level technical question relevant to ${preferences.jobType} at the ${preferences.experienceLevel} experience level. Base your question on their previous answer if relevant.`;
      } else if (
        questionsAsked >= 3 &&
        questionsAsked < 6 &&
        focusAreas.includes("behavioral")
      ) {
        // Behavioral questions
        category = "behavioral";
        instruction = `Ask a behavioral interview question appropriate for a ${preferences.jobType} position. Focus on teamwork, conflict resolution, or past experiences.`;
      } else if (questionsAsked < 8) {
        // Mix of follow-up questions
        category = "follow_up";
        instruction = `Based on the candidate's last answer, ask a relevant follow-up question to dive deeper or explore related topics.`;
      } else {
        // Closing
        category = "closing";
        instruction = `Thank the candidate for their time and ask if they have any questions for you or if there's anything they'd like to add.`;
      }

      // Create the system context
      const systemContext = `You are conducting a professional interview for a ${preferences.jobType} position with a candidate at the ${preferences.experienceLevel} level. The interview difficulty is ${preferences.difficulty}.

IMPORTANT GUIDELINES:
- Keep your response concise (1-3 sentences max)
- Be professional but friendly
- Ask only ONE question at a time
- DO NOT include any labels like "AI:" or "INTERVIEWER:"
- Respond in plain text, ready to be spoken aloud
- If the candidate gave a good answer, briefly acknowledge it before the next question
- Make questions relevant to ${preferences.jobType}`;

      // Create the current instruction
      const currentInstruction = `${instruction}

Generate your interview question or response now.`;

      // Call Gemini service
      const responseText = await geminiService.generateContextualResponse(
        systemContext,
        conversationHistory,
        currentInstruction,
        { temperature: 0.8, maxTokens: 500 }
      );
      console.log("Generated response:", responseText);

      // Clean up any potential labels or formatting
      const cleanedResponse = responseText
        .replace(/^(AI|INTERVIEWER|ASSISTANT):\s*/i, "")
        .replace(/^\*\*.*?\*\*:?\s*/g, "")
        .trim();

      // Generate question ID
      const questionId = `q_${Date.now()}_${questionsAsked}`;

      // Add question to session
      session.questions.push({
        questionId: questionId,
        question: cleanedResponse,
        category: category,
        askedAt: new Date(),
      });

      session.currentQuestion += 1;
      await session.save();

      console.log(`Generated ${category} question using Gemini Service`);

      return {
        text: cleanedResponse,
        audioUrl: null, // Browser TTS handles audio
        questionId: questionId,
        feedback: userInput
          ? generateFeedback(userInput)
          : "Let's get started!",
      };
    } catch (error) {
      console.error("Error generating AI interview response:", error);

      // Fallback to basic question if Gemini fails
      const fallbackQuestions = {
        0: "Hello! Thank you for joining this interview. To get started, could you please tell me about yourself and your background?",
        1: "That's great! Can you share a specific project or achievement you're particularly proud of?",
        2: "Interesting! What challenges did you face and how did you overcome them?",
        3: "Thank you for sharing. How do you approach teamwork and collaboration?",
        default:
          "Could you tell me more about your experience and what you're looking for in your next role?",
      };

      const questionIndex = session.questions.length;
      const fallbackText =
        fallbackQuestions[questionIndex] || fallbackQuestions.default;

      const questionId = `fallback_${Date.now()}`;
      session.questions.push({
        questionId: questionId,
        question: fallbackText,
        category: "introduction",
        askedAt: new Date(),
      });

      session.currentQuestion += 1;
      await session.save();

      return {
        text: fallbackText,
        audioUrl: null,
        questionId: questionId,
        feedback: "Let's continue with the interview.",
      };
    }
  };

  /**
   * Get interview questions based on user preferences
   */
  const getInterviewQuestions = (preferences) => {
    const jobType = preferences.jobType;
    const experienceLevel = preferences.experienceLevel;
    const focusAreas = preferences.focusAreas || [];

    // Base questions that work for most roles
    const baseQuestions = {
      introduction: {
        id: "intro_1",
        question:
          "Hello! Thank you for joining this interview practice session. To get started, could you please tell me a little about yourself and your background?",
      },
      technical: [],
      behavioral: [],
    };

    // Add job-specific technical questions
    if (focusAreas.includes("technical_skills")) {
      switch (jobType) {
        case "software_engineer":
          baseQuestions.technical = [
            {
              id: "tech_1",
              question:
                "Can you walk me through a challenging technical problem you've solved recently? What was your approach and what did you learn from it?",
            },
            {
              id: "tech_2",
              question:
                "How do you approach debugging a complex issue? Can you give me an example of a particularly difficult bug you had to fix?",
            },
            {
              id: "tech_3",
              question:
                "Describe your experience with version control systems. How do you handle merge conflicts or code reviews?",
            },
          ];
          break;
        case "data_scientist":
          baseQuestions.technical = [
            {
              id: "tech_1",
              question:
                "Can you explain a data science project you've worked on? What was the most challenging aspect and how did you overcome it?",
            },
            {
              id: "tech_2",
              question:
                "How do you handle missing data or outliers in your datasets? Can you give a specific example?",
            },
          ];
          break;
        default:
          baseQuestions.technical = [
            {
              id: "tech_1",
              question:
                "Can you describe a technical challenge you've faced in your work and how you solved it?",
            },
          ];
      }
    }

    // Add behavioral questions if requested
    if (focusAreas.includes("behavioral")) {
      baseQuestions.behavioral = [
        {
          id: "beh_1",
          question:
            "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
        },
        {
          id: "beh_2",
          question:
            "Describe a situation where you failed at something. What did you learn from that experience?",
        },
        {
          id: "beh_3",
          question:
            "Can you give an example of a time when you had to learn something new quickly? How did you approach it?",
        },
      ];
    }

    return baseQuestions;
  };

  /**
   * Generate follow-up response for ongoing conversation
   */
  const generateFollowUpResponse = (session, userInput) => {
    const responses = [
      "Thank you for that detailed answer. That's very helpful.",
      "I appreciate you sharing that experience with me.",
      "That's an interesting perspective. Can you tell me more about that?",
      "Thank you for your response. Is there anything else you'd like to add?",
      "I understand. Let me ask you one more thing about this topic.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  /**
   * Generate feedback for user response
   */
  const generateFeedback = (userInput) => {
    // Simple feedback based on response length and structure
    const wordCount = userInput.split(" ").length;

    if (wordCount < 10) {
      return "Try to provide more detail in your answers. Interviewers appreciate comprehensive responses.";
    } else if (wordCount > 50) {
      return "Good detail in your response! You provided a well-structured answer.";
    } else {
      return "Clear and concise response. Good job maintaining appropriate length.";
    }
  };
};
