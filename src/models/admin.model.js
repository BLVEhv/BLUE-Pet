import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: { type: String, default: "", required: true },
  password: { type: String, default: null, required: true },
  role: String,
});

export const Admin = mongoose.model("admins", adminSchema);
