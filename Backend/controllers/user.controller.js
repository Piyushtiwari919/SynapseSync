import mongoose from "mongoose";
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

    // --- FIX 1: Pagination Math ---
    // We calculate exactly how many documents to skip based on the page number.
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10; // Default to 10 to match the frontend
    let skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    }).select("fromUserId toUserId");

    const connectedUsersIdsSet = new Set();
    connectionRequests.forEach((connection) => {
      const othersId = connection.fromUserId.equals(loggedInUser._id)
        ? connection.toUserId
        : connection.fromUserId;
      connectedUsersIdsSet.add(othersId.toString());
    });

    // --- FIX 2: ObjectId Conversion ---
    // MongoDB Aggregation strictly requires ObjectIds. It will not match strings!
    const connectedUsersIds = Array.from(connectedUsersIdsSet).map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    const userInterestedTags = loggedInUser.skills || [];

    // --- FIX 3: Define oneDayAgo ---
    // We must define this variable before using it in the pipeline
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pipeline = [
      {
        $addFields: {
          connectionScore: {
            $cond: [{ $in: ["$userId", connectedUsersIds] }, 50, 0],
          },
          tagScore: {
            $cond: [
              {
                $gt: [
                  {
                    $size: { $setIntersection: ["$tags", userInterestedTags] },
                  },
                  0,
                ],
              },
              30,
              0,
            ],
          },
          recencyScore: {
            $cond: [{ $gte: ["$createdAt", oneDayAgo] }, 20, 0],
          },
        },
      },
      {
        $addFields: {
          totalScore: {
            $add: ["$connectionScore", "$tagScore", "$recencyScore"],
          },
        },
      },
      {
        $sort: { totalScore: -1, _id: -1 },
      },
      // --- FIX 4: Apply Skip and Limit ---
      // The order here is CRITICAL. Sort first, then skip, then limit.
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const feed = await Post.aggregate(pipeline);

    // --- FIX 5: Full Population ---
    // Added comment population back in so your UI doesn't break when rendering comments
    const populatedFeed = await Post.populate(feed, [
      { path: "userId", select: "firstName lastName profileImageUrl" },
      {
        path: "comments.authorId",
        select: "firstName lastName profileImageUrl _id isVerified",
      },
    ]);

    return res.status(200).json({ feed: populatedFeed });
  } catch (error) {
    console.error("Feed Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch feed", error: error.message });
  }
};

export {
  getRequestsReceived,
  getConnections,
  getProfileConnections,
  getRequestSend,
  getFeed,
};
