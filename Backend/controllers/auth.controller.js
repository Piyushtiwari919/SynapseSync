import validator from "validator";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validateSignUpData } from "../utils/validator.js";
import { getSanatizedUser } from "../utils/userSanatization.js";
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
    const hasshedPassword = await bcrypt.hash(password,10);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:hasshedPassword,
        skills,
        about,
        age,
        gender
    });
    await user.save();
    return res.send("User Registered Successfully");
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

authController.login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const isEmailValid = validator(emailId);
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
    const tokenTiming = { expires: new Date(Date.now() + timeOfCookie) };

    res.cookie(
      "token",
      token,
      {
        httpOnly: true,
        secure: true,
      },
      tokenTiming
    );

    const sanatizedUser = getSanatizedUser(user);
    return res.status(200).send(sanatizedUser);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.message}`);
  }
};

authController.logout = async (req, res) => {
  try {
    const { token } = req.cookie;
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
