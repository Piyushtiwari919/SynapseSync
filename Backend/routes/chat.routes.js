import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import {
  getChatsForLoggedInUser,
  getChatsByUserId,
  updateSeenChats,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.get("/chat/:targetUserId", userAuth,getChatsByUserId);

chatRouter.get("/chats", userAuth, getChatsForLoggedInUser);

chatRouter.patch("/chats/update/:targetUserId", userAuth, updateSeenChats);

export default chatRouter;
