import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.NODE_MAILER_APP_PASSWORD,
  },
});

const sendOtp = async (req, res) => {
  try {
    const { emailId } = req.user;
    if (!emailId) {
      throw new Error("Please Login to your account to continue");
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await OTP.deleteMany({ emailId });

    await OTP.create({
      emailId,
      otp,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_ID,
      to: emailId,
      subject: "Your Verification Code",
      text: `Your verification code is ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { emailId } = req.user;
    const { otp } = req.body;
    if (!emailId) {
      throw new Error("Please Login to your account to continue");
    }

    if (!otp) {
      throw new Error("Enter a valid Otp");
    }

    const userOtpRecord = await OTP.findOne({ emailId });

    const isOtpValid = await bcrypt.compare(otp, userOtpRecord.otp);

    if (!isOtpValid) {
      throw new Error("Please Enter a valid OTP");
    }

    await User.updateOne({ emailId }, { isVerified: true });

    await OTP.deleteOne({ _id: userOtpRecord._id });

    return res.status(200).send("Otp Verification Successfull");
  } catch (error) {
    console.error(error);
    res.status(500).send(`${error.message}`);
  }
};

export { sendOtp, verifyOtp };
