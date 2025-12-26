import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import connectDB from "./config/connectDB.js";

const corsOptions ={
  origin:"http://localhost:5173",
  credentials:true
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);

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
