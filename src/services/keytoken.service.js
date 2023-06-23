"use strict";

import { keyTokenModel } from "../models/keytoken.model.js";
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { _id: userId };
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
    return await keyTokenModel.findOne({ _id: userId }).lean();
  };

  static deleteKeyToken = async (userId) => {
    return await keyTokenModel.deleteOne({ _id: userId });
  };
}

export default KeyTokenService;
