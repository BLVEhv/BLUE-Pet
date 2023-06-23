import { Admin } from "../models/admin.model.js";

const findAdminByUsername = async ({ username }) => {
  return await Admin.findOne({ username });
};

export { findAdminByUsername };
