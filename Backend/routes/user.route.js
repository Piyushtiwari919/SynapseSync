import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { getConnections, getFeed, getRequestsRecieved } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("user/request/recieved", userAuth, getRequestsRecieved);

userRouter.get("/user/connections", userAuth, getConnections);

userRouter.get("/feed", userAuth, getFeed);

export default userRouter;
