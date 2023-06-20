"use strict";

import AccessService from "../services/access.service.js";
import { OK, CREATED, SuccessResponse } from "../core/success.response.js";

class AccessController {
  logIn = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.logIn(req.body),
    }).send(res);
  };

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
