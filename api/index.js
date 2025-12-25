import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors'
import connectDB from "./config/db.js";
import router from "./Routes/Authroute.js";
import UserRoute from "./Routes/Userroute.js";
import categoryRoutes from './Routes/Categoryroute.js';
import BlogRoute from "./Routes/Blogroute.js";
import CommentRoute from "./Routes/Commentrouts.js";
import LikeRoute from "./Routes/likeroute.js";
import morgan from 'morgan';




//  Load environment variables
dotenv.config();
connectDB();

const app = express();

//  Access env variables
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin:process.env.FRONTEND_URL,
      credentials: true

}))
app.use(cookieParser());
app.use(express.json())
app.use(morgan('dev'));



//  Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//  Start server

// SignUp and Signin
app.use('/api/auth',router)
//update profile
app.use('/api/user',UserRoute)

app.use('/api/category', categoryRoutes);
app.use('/api/blog', BlogRoute);
app.use('/api/comment', CommentRoute);
app.use('/api/like', LikeRoute);


// Catch 404
app.use((error,req, res, next) => {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal sever error'
  res.status(statusCode).json({
    success:false,
    statusCode,message
  })
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});