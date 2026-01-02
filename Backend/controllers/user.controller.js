import ConnectionRequest from "../models/connectionRequest.model.js";
import Post from "../models/post.model.js";

const getRequestsRecieved = async (req, res) => {
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
      connectionRequestsRecieved: connectionRequests,
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
    }).populate("fromUserId toUserId", "firstName lastName photUrl");

    const filteredResponse = connectionRequests.map((connection) => {
      if (connection.fromUserId.toString() === loggedInUser._id) {
        return connection.fromUserId;
      }
      return connection.toUserId;
    });

    return res.status(200).send(filteredResponse);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
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

    const connectedUsers = new Set();

    connectionRequest.forEach((connection) => {
      const othersIds =
        connection.fromUserId.toString() === loggedInUser._id
          ? connection.toUserId.toString()
          : connection.fromUserId.toString();
      connectedUsers.add(othersIds);
    });

    const allPosts = await Post.find({
      $and: [{ userId: { $in: Array.from(connectedUsers) } }],
    })
      .sort({ createdAt: -1 }) //Sorted by new posts first
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName lastName profileImageUrl");

    let morePosts = [];

    if (allPosts.length < limit) {
      const existingPostIds = allPosts.map((post) => post._id);
      morePosts = await Post.find({
        $and: [
          { _id: { $nin: existingPostIds } },
          { userId: { $ne: loggedInUser._id } },
          { userId: { $nin: Array.from(connectedUsers) } },
        ],
      })
        .skip(skip)
        .limit(limit - allPosts.length)
        .populate("userd", "firstName lastName profileImageUrl");
    }

    return res
      .status(200)
      .json({ userPrefrencePosts: allPosts, extraPosts: morePosts });
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

export { getRequestsRecieved, getConnections, getFeed };
