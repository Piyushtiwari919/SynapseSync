import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import userRouter from "./routes/user.route.js";
import connectDB from "./config/connectDB.js";
import requestRouter from "./routes/request.route.js";
import exploreRouter from "./routes/explore.route.js";
import postRouter from "./routes/post.route.js";

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", exploreRouter);
app.use("/", postRouter);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("Database Connection established");
    app.listen(PORT, () => {
      console.log(`Server is listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err, "Database Connection failed");
  });
