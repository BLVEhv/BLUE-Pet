"use strict";

import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";

class AccessService {
  static signUp = async ({ username, email, password }) => {
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
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });
      }
    } catch (err) {
      return {
        message: err.message,
        status: "error",
      };
    }
  };
}

export default AccessService;
