import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new Schema({
  emailId: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 300 seconds = 5 minutes. Doc is auto-deleted after this.
  },
});

otpSchema.pre("save", async function (next) {
  if (this.isModified("otp")) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }
});

const OTP = model("OTP", otpSchema);

export default OTP;
