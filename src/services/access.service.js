"use strict";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import KeyTokenService from "./keytoken.service.js";
import { createTokenPair } from "../auth/authUtil.js";
import getInfoData from "./../utils/index.js";
import {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
} from "../core/error.response.js";
import { findByUsername } from "./user.service.js";

class AccessService {
  static logOut = async (keyStore) => {
    const delKey = await KeyTokenService.deleteKeyToken(keyStore._id);
    return delKey;
  };
  static logIn = async ({ username, password, refreshToken }) => {
    //1.check username in db
    const foundUser = await findByUsername({ username });
    if (!foundUser) {
      throw new BadRequestError("User is not registered");
    }
    //2.match password
    const matchPassword = bcrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      throw new AuthFailureError("Authentication error");
    }
    //3.create accessToken and refreshToken and save
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    //4.generate tokens
    const { _id: userId } = foundUser;
    const token = await createTokenPair(
      {
        userId,
        username,
      },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      refreshToken: token.refreshToken,
      publicKey,
      privateKey,
      userId,
    });
    //5.get data and return login
    return {
      user: getInfoData({
        fields: ["_id", "username", "email"],
        object: foundUser,
      }),
      token,
    };
  };

  static signUp = async ({ username, email, mobile, password }) => {
    const holderUser = await User.findOne({ username }).lean();
    const hashPassword = await bcrypt.hash(password, 10);

    if (holderUser) {
      throw new BadRequestError("Error: User is already registered");
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
        throw new BadRequestError("Error: keyStore error!");
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
  };
}

export default AccessService;
