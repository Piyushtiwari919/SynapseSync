import { getSanatizedUser } from "../utils/userSanatization.js";
import { validateProfileEdit } from "../utils/validator.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const handleProfileView = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User Not Found");
    }
    const sanatizedUser = getSanatizedUser(user);
    return res.status(200).send(sanatizedUser);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

const handleProfileEdit = async (req, res) => {
  try {
    if (!validateProfileEdit(req)) {
      throw new Error("Invalid Request Recieved");
    }
    const avatarLocalPath = req?.file?.path;
    let avatar;
    if (avatarLocalPath) {
      avatar = await uploadOnCloudinary(avatarLocalPath);
    }
    const user = req.user;
    const updates = Object.keys(req.body);
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    if (avatar) {
      user["profileImageUrl"] = avatar?.url;
    }
    await user.save();

    const sanatizedUser = getSanatizedUser(user);
    return res.status(200).send(sanatizedUser);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

export { handleProfileView, handleProfileEdit };
