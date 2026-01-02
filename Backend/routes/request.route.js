import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import { handleRequest } from "../controllers/request.controller.js";

const requestRouter = Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  handleRequest
);
