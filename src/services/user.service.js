import { User } from "../models/user.model.js";

const findByUsername = async ({
  username,
  select = {
    username: 1,
    email: 1,
    mobile: 1,
    password: 1,
    role: 1,
  },
}) => {
  return await User.findOne({ username }).select(select).lean();
};

export { findByUsername };
