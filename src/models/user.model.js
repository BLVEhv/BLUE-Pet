import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: String,
  salt: String,
  name: { type: String },
  age: { type: Number },
  address: { type: String },
  dob: { type: Date },
  refreshToken: { type: [String], default: [] },
  roles: { type: [String], default: ["user"] },
});

const User = model("User", UserSchema);

export default User;
