import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { accessToken } = cookies;
    
    if (!accessToken) {
      return res.status(401).send("Unauthorized User. Please Login");
    }

    const decodedObj = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const { userId } = decodedObj;

    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new Error("User Not Found");
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).send("ERROR: " + error.message);
  }
};

export const requireVerification = (req, res, next) => {
  try {
    if (!req.user.isVerified) {
      throw new Error(
        "Action restricted. Please verify your email to post or comment."
      );
    }
    next();
  } catch (error) {
    return res.status(403).send(`${error.message}`);
  }

};
