import Status from "../models/status.model.js";
import User from "../models/user.model.js";

const statusController = {};

const getUserStatus = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { targetUserId } = req.params;
    if (!userId) {
      return res.status(401).send("Unauthorized Request");
    }
    if (!targetUserId) {
      throw new Error("No target user id present");
    }

    if (userId.toString() === targetUserId.toString()) {
      throw new Error("target user id and user id cannot be same");
    }

    let status = await Status.findOne({ userId: targetUserId });

    if (!status) {
      const userExist = await User.findById(targetUserId);
      if (!userExist) {
        return res.status(401).send("User does not exist");
      }
      status = await Status.findOneAndUpdate(
        { userId: targetUserId }, // 1. The query
        { $set: { isOnline: false } }, // 2. The update
        {
          new: true, // 3. Return the document AFTER the update
          upsert: true, // 4. Create the document if it doesn't exist
          setDefaultsOnInsert: true, // 5. Apply Mongoose schema defaults (like timestamps)
        },
      );
      //console.log(status);
    }
    return res.status(200).send({ userStatus: status });
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

statusController.online = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).send("Unauthorized user");
    }
    const status = await Status.findOneAndUpdate(
      { userId: userId },
      { $set: { isOnline: true } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
    return res.status(200).send(status);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

statusController.offline = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).send("Unauthorized user");
    }
    const status = await Status.findOneAndUpdate(
      { userId: userId },
      { $set: { isOnline: false } },
      {
        setDefaultsOnInsert: true,
      },
    );
    return res.status(200).send(status);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

export { getUserStatus, statusController };
