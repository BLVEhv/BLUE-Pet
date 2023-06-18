"use strict";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import KeyTokenService from "./keytoken.service.js";
import createTokenPair from "../auth/authUtil.js";
import getInfoData from "./../utils/index.js";

class AccessService {
  static signUp = async ({ username, email, mobile, password }) => {
    try {
      const holderUser = await User.findOne({ username }).lean();
      const hashPassword = await bcrypt.hash(password, 10);

      if (holderUser) {
        res.json("User is already registered");
      }
      const newUser = await User.create({
        username,
        email,
        mobile,
        password: hashPassword,
        role: "User",
      });

      if (newUser) {
        //create publicKey and privateKey
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            message: "tokenKey error",
          };
        }

        //create token pair
        const token = await createTokenPair(
          {
            userId: newUser._id,
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
              object: newUser,
            }),
            token,
          },
        };
      }
      return {
        code: 201,
        metadata: null,
      };
    } catch (err) {
      return {
        message: err.message,
        status: "error",
      };
    }
  };
}

export default AccessService;
