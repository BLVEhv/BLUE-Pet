import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, default: "", required: true },
  password: { type: String, default: null, required: true },
  role: String,
});

export const User = mongoose.model("users", userSchema);
