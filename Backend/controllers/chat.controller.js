import Chat from "../models/chat.model.js";

const getChatsForLoggedInUser = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new Error("UserId not found");
    }
    const userChats = await Chat.find({
      participants: { $all: [userId] },
    }).populate({
      path: "participants",
      select: "firstName profileImageUrl",
    });

    return res.status(200).send(userChats);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

const getChatsByUserId = async (req, res) => {
  try {
    const targetUserId = req.params?.targetUserId;
    if (!targetUserId) {
      throw new Error("No Target UserId provided");
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).send("Unauthorized User");
    }

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

    await chat.populate({
      path: "participants",
      select: "firstName lastName profileImageUrl",
    });

    await chat.save();

    return res.json(chat);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

const updateSeenChats = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const loggedInUser = req.user;
    const userId = loggedInUser?._id;
    if (!loggedInUser) {
      return res.status(401).send("Unauthorized user");
    }
    if (!targetUserId) {
      throw new Error("Target User id not found");
    }
    await Chat.findOneAndUpdate(
      {
        participants: { $all: [userId, targetUserId] },
        "messages.senderId": targetUserId,
      },
      { $set: { "messages.$[elem].seen": true } },
      {
        arrayFilters: [{ "elem.senderId": targetUserId, "elem.seen": false }],
        new: true,
      },
    );
    return res.status(200).json({ message: "DB Updated Successfully" });
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

export { getChatsForLoggedInUser, getChatsByUserId, updateSeenChats };
