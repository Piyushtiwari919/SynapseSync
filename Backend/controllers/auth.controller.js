import validator from "validator";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validateSignUpData } from "../utils/validator.js";
import { getSanatizedUser } from "../utils/userSanatization.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
const authController = {};

authController.register = async (req, res) => {
  try {
    validateSignUpData(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      skills,
      about,
      age,
      gender,
    } = req.body;

    const userExist = await User.find({ emailId: emailId });
    if (userExist.length > 0) {
      throw new Error("Email already exist. Please Login");
    }
    const avatarLocalPath = req?.file?.path;
    let avatar;
    if (avatarLocalPath) {
      avatar = await uploadOnCloudinary(avatarLocalPath);
    }
    // console.log(avatar);
    const hasshedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hasshedPassword,
      skills,
      about: about,
      age,
      gender,
      profileImageUrl: avatar?.url,
    });
    await user.save();

    const token = await user.getJWT();
    if (!token) {
      throw new Error("Something went wrong");
    }

    const timeOfCookie = 24 * 60 * 60 * 1000;

    res.cookie("token", token, {
      expires: new Date(Date.now() + timeOfCookie),
      httpOnly: true,
      secure: true,
    });

    const sanatizedUser = getSanatizedUser(user);
    return res.status(200).send(sanatizedUser);
    // return res.send("User Registered Successfully");
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

authController.login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const isEmailValid = validator.isEmail(emailId);
    if (!isEmailValid) {
      throw new Error("Please enter a valid email");
    }
    const isPasswordLengthValid = password.length >= 6;
    if (!isPasswordLengthValid) {
      throw new Error("Password must be at least 6 characters long");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordCorrect = await user.passwordValidation(password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials");
    }

    const token = await user.getJWT();
    if (!token) {
      throw new Error("Something went wrong");
    }

    const timeOfCookie = 7 * 24 * 60 * 60 * 1000;

    res.cookie("token", token, {
      expires: new Date(Date.now() + timeOfCookie),
      httpOnly: true,
      secure: true,
    });

    const sanatizedUser = getSanatizedUser(user);
    return res.status(200).send(sanatizedUser);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

authController.logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedMessage) {
      throw new Error("Something went wrong");
    }

    return res
      .cookie("token", null, { expires: new Date(Date.now()) })
      .send("Logged Out Successfully");
  } catch (error) {
    return res.status(401).send(`ERROR: ${error.message}`);
  }
};

export default authController;
