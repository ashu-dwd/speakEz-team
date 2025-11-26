import express from "express";
import userRoute from "./Routes/userRoute.js";
import cors from "cors";
import userDataRoute from "./Routes/userDataRoute.js";
import chatRoute from "./Routes/chatRoute.js";
import aiCharRoute from "./Routes/aiCharRoute.js";
import connectDB from "./connect.js";
import verifyToken from "./Middlewares/auth.js";

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
