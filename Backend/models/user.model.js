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
      trype: String,
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
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error(`Please Enter a valid Photo URL: ${value}`);
        }
      }
    },
    age:{
        type:String,
        trim:true
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","others"],
            message:`{VALUE} is not a valid gender type`
        }
    },
    role:{
        type:String,
        enum:{
            values:["user","admin"],
            message:`{VALUE} is not a valid role type`
        },
        default:"user"
    },
    about: {
      type: String,
      trim: true,
      default: "Hey there. How are you?",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function (){
    const token = jwt.sign({userId:this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRY_TIME});
    return token;
}

userSchema.methods.passwordValidation = async function (password) {
  const isPasswordCorrect = await bcrypt.compare(password, this.password);
  return isPasswordCorrect;
};

const User = model("User", userSchema);

export default User;
