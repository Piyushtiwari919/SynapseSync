import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
const app = express();
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import userRouter from "./routes/user.route.js";
import connectDB from "./config/connectDB.js";
import requestRouter from "./routes/request.route.js";
import exploreRouter from "./routes/explore.route.js";
import postRouter from "./routes/post.route.js";
import emailRouter from "./routes/email.route.js";
import chatRouter from "./routes/chat.routes.js";
import initializeSocket from "./chat/chat.socket.js";
import statusRouter from "./routes/status.route.js";

// --- ADD THIS SANITY CHECK LOG ---
console.log("=== SERVER BOOTING ===");
console.log("Allowed CORS Origin:", process.env.FRONTEND_URL);
console.log("======================");

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", exploreRouter);
app.use("/", postRouter);
app.use("/", emailRouter);
app.use("/", chatRouter);
app.use("/", statusRouter);

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("Database Connection established");
    server.listen(PORT, () => {
      console.log(`Server is listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err, "Database Connection failed");
  });
