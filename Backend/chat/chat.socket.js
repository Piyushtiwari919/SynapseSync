import { Server } from "socket.io";
import crypto from "crypto";

import tokenVerification from "../middlewares/tokenMiddleware.js";
import Chat from "../models/chat.model.js";
import { messageSanitization } from "../utils/userSanatization.js";
import Status from "../models/status.model.js";

const getSecretId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$%-+"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,//"http://localhost:5173",
      credentials: true,
    },
  });

  // MiddleWare for token
  tokenVerification(io);

  io.on("connection", (socket) => {
    const userId = socket?.userId;
    socket.on("joinChat", async ({ targetUserId }) => {
      const roomId = getSecretId(userId, targetUserId);
      socket.join(roomId);
      //*upsert: true is the magic word: It tells MongoDB, "Try to find this user.
      //* If they exist, update them. If they do not exist, create a new document with these details."
      await Status.updateOne(
        { userId: userId },
        { $set: { isOnline: true } },
        { upsert: true },
      );
    });

    socket.on(
      "sendMessage",
      async ({ userName, userId, targetUserId, text }) => {
        try {
          // Messaage validation
          messageSanitization(text);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat?.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          await chat.populate({
            path: "messages.senderId",
            select: "firstName",
          });
          const roomId = getSecretId(userId, targetUserId);
          io.to(roomId).emit("receivedMessage", { messages: chat?.messages });
        } catch (error) {
          console.error(error);
        }
      },
    );

    socket.on("disconnect", async () => {
      await Status.updateOne({ userId: userId }, { $set: { isOnline: false } });
      console.log("User Disconnected");
    });
  });
};

export default initializeSocket;
