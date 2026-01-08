import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";
import { getSanatizedUser } from "../utils/userSanatization.js";

const getProfiles = async (req, res) => {
  try {
    const loggedInUser = req.user;

    /* Pagination */
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * limit;

    const suggestedUsers = await User.find({
      _id: { $nin: loggedInUser._id },
    })
      .skip(skip)
      .limit(limit);

    const getConnections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const connectionsIdsSet = new Set();

    getConnections.forEach((connection) => {
      const othersIds =
        connection.fromUserId.toString() === loggedInUser._id.toString()
          ? connection.toUserId.toString()
          : connection.fromUserId.toString();
      connectionsIdsSet.add(othersIds);
    });

    const filteredSuggestedUser = suggestedUsers.filter((user) => {
      return !connectionsIdsSet.has(user._id.toString());
    });

    // console.log(filteredSuggestedUser);

    const sanatizedSuggestedUser = filteredSuggestedUser.map((user) => {
      return getSanatizedUser(user);
    });

    return res.status(200).send(sanatizedSuggestedUser);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

export default getProfiles;
