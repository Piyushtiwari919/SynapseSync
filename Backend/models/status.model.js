import mongoose, { model, Schema } from "mongoose";

const statusSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isOnline: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

const Status = model("Status", statusSchema);

export default Status;
