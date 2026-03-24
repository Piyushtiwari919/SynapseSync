import { Router } from "express";
import Chat from "../models/chat.model.js";
import { userAuth } from "../middlewares/auth.js";

const chatRouter = Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const  targetUserId  = req.params?.targetUserId;
    if (!targetUserId) {
      throw new Error("No Target UserId provided");
    }
    
    
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).send("Unauthorized User");
    }
    //console.log(targetUserId, userId);


    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
    }
    await chat.save();

    return res.json(chat);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
});

export default chatRouter;
