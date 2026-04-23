import ConnectionRequest from "../models/connectionRequest.model.js";
import Post from "../models/post.model.js";

const getRequestsReceived = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $and: [{ toUserId: loggedInUser._id }, { status: "interested" }],
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "profileImageUrl",
      "skills",
      "gender",
      "age",
      "about",
    ]);

    return res.status(200).json({
      message: "Data fetched successfully",
      connectionRequestsReceived: connectionRequests,
    });
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

const getRequestSend = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequestsSend = await ConnectionRequest.find({
      $and: [{ fromUserId: loggedInUser._id }, { status: "interested" }],
    }).populate("toUserId", [
      "firstName",
      "lastName",
      "profileImageUrl",
      "skills",
      "gender",
      "age",
      "about",
    ]);

    return res.status(200).json({
      message: "Data fetched successfully",
      connectionRequestsSend,
    });
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

const getConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate(
      "fromUserId toUserId",
      "firstName lastName profileImageUrl about",
    );

    const filteredResponse = connectionRequests.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    return res.status(200).send(filteredResponse);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

const getProfileConnections = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new Error("No userId provided");
    }
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: userId, status: "accepted" },
        { toUserId: userId, status: "accepted" },
      ],
    });

    //console.log(connectionRequests);

    return res.status(200).send(connectionRequests);
  } catch (error) {
    return res.status(400).send(`${error.message}`);
  }
};

const getFeed = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //All connection Requests except ignored ones
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: { $ne: "ignored" },
    }).populate("fromUserId toUserId");

    const connectedUsersIds = new Set();

    connectionRequest.forEach((connection) => {
      const othersIds =
        connection.fromUserId.toString() === loggedInUser._id.toString()
          ? connection.toUserId
          : connection.fromUserId;
      connectedUsersIds.add(othersIds._id.toString());
    });

    const allPosts = await Post.find({
      $and: [{ userId: { $in: Array.from(connectedUsersIds) } }],
    })
      .sort({ createdAt: -1 }) //Sorted by new posts first
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName lastName profileImageUrl")
      .populate({
        path: "comments",
        populate: {
          path: "authorId",
          select: "firstName profileImageUrl _id isVerified",
        },
      })
      .lean();

    let morePosts = [];

    if (allPosts.length < limit) {
      const existingPostIds = allPosts.map((post) => post._id);
      morePosts = await Post.find({
        $and: [
          { _id: { $nin: existingPostIds } },
          { userId: { $ne: loggedInUser._id } },
          { userId: { $nin: Array.from(connectedUsersIds) } },
        ],
      })
        .skip(skip)
        .limit(limit - allPosts.length)
        .populate("userId", "firstName lastName profileImageUrl")
        .populate({
          path: "comments",
          populate: {
            path: "authorId",
            select: "firstName lastName profileImageUrl _id isVerified",
          },
        })
        .lean();
    }

    return res
      .status(200)
      .json({ userPrefrencePosts: allPosts, extraPosts: morePosts });
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

export {
  getRequestsReceived,
  getConnections,
  getProfileConnections,
  getRequestSend,
  getFeed,
};
