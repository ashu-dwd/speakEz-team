import express from "express";
import userRoute from "./routes/user-route.js";
import cors from "cors";
import userDataRoute from "./routes/user-data-route.js";
import chatRoute from "./routes/chat-route.js";
import aiCharRoute from "./routes/ai-char-route.js";
import connectDB from "./connect.js";
import verifyToken from "./middlewares/auth.js";

const app = express();

const PORT = process.env.PORT || 3000;

//db connection
connectDB();
//cors
app.use(cors());

//middlewares for forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//middleware for routes
app.use("/api/user", userRoute);
app.use("/api/userData", verifyToken, userDataRoute);
app.use("/api/chat", chatRoute);
app.use("/api/aiChar", verifyToken, aiCharRoute);


if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
