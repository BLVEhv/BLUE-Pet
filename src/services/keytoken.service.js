"use strict";

import { keyTokenModel } from "../models/keytoken.model.js";
import { Types } from "mongoose";
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { id: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const token = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return token ? token.publicKey : null;
    } catch (err) {
      console.log(err);
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ id: userId }).lean();
  };

  static deleteKeyToken = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };
}

export default KeyTokenService;
