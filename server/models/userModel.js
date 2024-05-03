import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    Followers: {
      type: Array,
    },
    Following: {
      type: Array,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-7-1024.png",
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
