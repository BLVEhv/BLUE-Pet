import { Admin } from "../models/admin.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyAdminService from "./keyadmin.service.js";
import { AuthFailureError, BadRequestError } from "../core/error.response.js";
import { createTokenPair } from "../auth/authUtil.js";
import getInfoData from "./../utils/index.js";
import { SuccessResponse } from "../core/success.response.js";
import { Types } from "mongoose";

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

const adminChangePassword = async (
  clientId,
  { password, newPassword, verifyNewPassword }
) => {
  const adminFound = await Admin.findOne({ _id: clientId });
  if (!adminFound) {
    throw new AuthFailureError("Unauthorization");
  }
  try {
    const matchPassword = await bcrypt.compare(password, adminFound.password);

    if (!matchPassword) {
      throw new BadRequestError("The older password is not correct");
    } else {
      if (newPassword !== verifyNewPassword) {
        throw new BadRequestError(
          "New password and verify new password is not match"
        );
      } else {
        const adminUpdate = await Admin.findOneAndUpdate(
          adminFound._id,
          {
            password: await bcrypt.hash(verifyNewPassword, 10),
          },
          { upsert: true, new: true }
        );
        if (adminUpdate) {
          throw new SuccessResponse("Update password successfully");
        } else {
          throw new BadRequestError("Update password failed");
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  return {
    admin: getInfoData({
      fields: ["_id", "username", "email"],
      object: adminFound,
    }),
  };
};

const resetPasswordAdmin = async (param) => {
  const adminId = new Types.ObjectId(param.id);
  const adminFound = await Admin.findOneAndUpdate(
    { _id: adminId },
    {
      password: await bcrypt.hash("admin@123", 10),
    },
    {
      upsert: true,
      new: true,
    }
  );
  return {
    admin: getInfoData({
      fields: ["_id", "username", "email"],
      object: adminFound,
    }),
  };
};

export {
  findAdminByUsername,
  findAdminById,
  createAdmin,
  adminChangePassword,
  resetPasswordAdmin,
};
