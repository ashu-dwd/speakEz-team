import express from "express";
import userRoute from './Routes/userRoute.js';
import userDataRoute from './Routes/userDataRoute.js';
import connectDB from "./connect.js";
import verifyToken from "./Middlewares/auth.js";


const app = express();

const PORT = process.env.PORT || 3000;

//db connection
connectDB();


//middlewares for forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//middleware for routes
app.use('/api/user', userRoute);
app.use('/api/userData', verifyToken, userDataRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});