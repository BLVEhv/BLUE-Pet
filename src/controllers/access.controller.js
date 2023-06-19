"use strict";

import AccessService from "../services/access.service.js";
import { OK, CREATED } from "../core/success.response.js";

class AccessController {
  signUp = async (req, res, next) => {
    try {
      new CREATED({
        message: "Registered Successfully",
        metadata: await AccessService.signUp(req.body),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };
}

export default new AccessController();
