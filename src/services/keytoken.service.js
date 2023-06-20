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
      // const token = await keyTokenModel.create({
      //   id: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return token ? token.publicKey : null;

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
}

export default KeyTokenService;
