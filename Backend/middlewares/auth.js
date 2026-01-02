import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const {refreshToken} = cookies;
    if (!refreshToken) {
      return res.status(401).send("Unauthorized User. Please Login");
    }

    const decodedObj = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    const { userId } = decodedObj;
    const user = await User.findById({_id:userId});
    if (!user) {
      throw new Error("User Not Found");
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(400).send("ERROR: " + error.message);
  }
};


//--For future purposes--
// export const requireVerification = (req, res, next) => {
//   if (!req.user.isVerified) {
//     return res.status(403).json({ 
//       message: "Action restricted. Please verify your email to post or comment." 
//     });
//   }
//   next();
// };
