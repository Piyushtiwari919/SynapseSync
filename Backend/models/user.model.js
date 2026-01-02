import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "https://placehold.co/150?text=User",
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error(`Please Enter a valid Image URL: ${value}`);
        }
      },
    },
    age: {
      type: Number,
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: `{VALUE} is not a valid role type`,
      },
      default: "user",
    },
    about: {
      type: String,
      trim: true,
      default: "Hey there. How are you?",
    },
    skills: {
      type: [String],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
  },
  { timestamps: true }
);

userSchema.methods.getJWTRefreshToken = function () {
  const refreshToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME }
  );
  return refreshToken;
};

userSchema.methods.getJWTAccessToken = function () {
  const accessToken = jwt.sign(
    { userId: this._id, emailId: this.emailId, firstName:this.firstName },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME }
  );
  return accessToken;
};

userSchema.methods.passwordValidation = async function (password) {
  const isPasswordCorrect = await bcrypt.compare(password, this.password);
  return isPasswordCorrect;
};

const User = model("User", userSchema);

export default User;
