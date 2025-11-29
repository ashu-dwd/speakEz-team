import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoute from "./routes/user-route.js";
import cors from "cors";
import userDataRoute from "./routes/user-data-route.js";
import chatRoute from "./routes/chat-route.js"; // AI chat route
import chatRoomsRoute from "./routes/chat-rooms-route.js";
import aiCharRoute from "./routes/ai-char-route.js";
import sessionRoute from "./routes/session-route.js";
import statsRoute from "./routes/stats-route.js";
import settingsRoute from "./routes/settings-route.js";
import interviewRoute from "./routes/interview-route.js";
import connectDB from "./connect.js";
import verifyToken from "./middlewares/auth.js";
import { setupSocketHandlers } from "./socketHandlers.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Setup Socket.IO event handlers
setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;

//db connection
connectDB();
//cors
app.use(cors());

//middlewares for forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files for uploads
app.use("/uploads", express.static("uploads"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  });
});

//middleware for routes
app.use("/api/user", userRoute);
app.use("/api/userData", verifyToken, userDataRoute);
app.use("/api/chat", chatRoute);
app.use("/api/chat-rooms", chatRoomsRoute);
app.use("/api/aiChar", verifyToken, aiCharRoute);
app.use("/api/session", sessionRoute);
app.use("/api/stats", statsRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/interviews", interviewRoute);

// Debug endpoint to check queue status
app.get("/api/debug/queue", async (req, res) => {
  try {
    const CallQueue = (await import("./models/callQueue.js")).default;
    const queue = await CallQueue.find({}).sort({ joinedAt: 1 });
    res.json({
      success: true,
      queueCount: queue.length,
      queue: queue.map((q) => ({
        userId: q.userId,
        status: q.status,
        joinedAt: q.joinedAt,
        socketId: q.socketId,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
