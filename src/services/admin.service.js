import { Admin } from "../models/admin.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyAdminService from "./keyadmin.service.js";
import { BadRequestError } from "../core/error.response.js";
import { createTokenPair } from "../auth/authUtil.js";
import getInfoData from "./../utils/index.js";

const findAdminByUsername = async ({ username }) => {
  return await Admin.findOne({ username });
};

const findAdminById = async (id) => {
  return await Admin.findOne({ _id: id });
};

const createAdmin = async ({ username, email, password }) => {
  const holderAdmin = await Admin.findOne({ username }).lean();
  const hashPassword = await bcrypt.hash(password, 10);

  if (holderAdmin) {
    throw new BadRequestError("Admin is already exist");
  }
  const newAdmin = await Admin.create({
    username,
    email,
    password: hashPassword,
    role: "Admin",
  });

  if (newAdmin) {
    //create publicKey and privateKey
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const keyStore = await KeyAdminService.createKeyToken({
      adminId: newAdmin._id,
      publicKey,
      privateKey,
    });

    if (!keyStore) {
      throw new BadRequestError("Error: keyStore error!");
    }

    //create token pair
    const token = await createTokenPair(
      {
        adminId: newAdmin._id,
        username,
      },
      publicKey,
      privateKey
    );
    console.log("Token created successfully", token);

    return {
      code: 201,
      metadata: {
        user: getInfoData({
          fields: ["_id", "username", "email"],
          object: newAdmin,
        }),
        token,
      },
    };
  }
  return {
    code: 201,
    metadata: null,
  };
};

export { findAdminByUsername, findAdminById, createAdmin };
