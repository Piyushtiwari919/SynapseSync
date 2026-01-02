import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";

const handleRequest = async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];

    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid Status Type");
    }

    const toUser = await User.findById({ _id: toUserId });
    if (!toUser) {
      return res.status(404).json({
        message: "Invalid connection Request : User doesn't exist",
      });
    }

    const existingConnectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: toUserId, fromUserId: fromUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res.status(404).json({
        message: "Connection Request Already exist",
      });
    }
    const connectionRequest = await ConnectionRequest.create({
      fromUserId: fromUserId,
      toUserId: toUserId,
      status: status,
    });

    res.json({
      message: "Connection Request Send Successfully",
      connectionRequest,
    });
  } catch (error) {
    const serialized = JSON.parse(
      JSON.stringify(err, Object.getOwnPropertyNames(err))
    );

    return res.status(400).json({
      message: "Invalid Request : Please check the url or data",
      errorMsg: err.message || serialized,
      details: err.errors || serialized,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export { handleRequest };
