"use strict";

import { keyTokenModel } from "../models/keytoken.model.js";

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const token = await keyTokenModel.create({
        id: userId,
        publicKey,
        privateKey,
      });
      return token ? token.publicKey : null;
    } catch (err) {
      console.log(err);
    }
  };
}

export default KeyTokenService;
