import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import {
  handleRequestSend,
  handleRequestRecieved,
} from "../controllers/request.controller.js";

const requestRouter = Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  handleRequestSend
);

requestRouter.post(
  "/request/review/:status/:fromUserId",
  userAuth,
  handleRequestRecieved
);

export default requestRouter;
