import express from "express";
import { userAuth } from "../middlewares/auth.js";
import {
  getConnections,
  getFeed,
  getRequestSend,
  getRequestsReceived,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, getRequestsReceived);

userRouter.get("/user/connections", userAuth, getConnections);

userRouter.get("/user/request/send", userAuth, getRequestSend);

userRouter.get("/feed", userAuth, getFeed);

export default userRouter;
