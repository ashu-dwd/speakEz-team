import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoute from "./routes/user-route.js";
import cors from "cors";
import userDataRoute from "./routes/user-data-route.js";
import chatRoute from "./routes/chat-route.js";
import aiCharRoute from "./routes/ai-char-route.js";
import sessionRoute from "./routes/session-route.js";
import statsRoute from "./routes/stats-route.js";
import settingsRoute from "./routes/settings-route.js";
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

//middleware for routes
app.use("/api/user", userRoute);
app.use("/api/userData", verifyToken, userDataRoute);
app.use("/api/chat", chatRoute);
app.use("/api/aiChar", verifyToken, aiCharRoute);
app.use("/api/session", sessionRoute);
app.use("/api/stats", statsRoute);
app.use("/api/settings", settingsRoute);

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
