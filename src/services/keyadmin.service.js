import { keyAdmin } from "../models/keyadmin.model.js";

class KeyAdminService {
  static createKeyToken = async ({
    adminId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { _id: adminId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const token = await keyAdmin.findOneAndUpdate(filter, update, options);
      return token ? token.publicKey : null;
    } catch (err) {
      console.log(err);
    }
  };
}

export default KeyAdminService;
