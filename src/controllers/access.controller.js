"use strict";

import AccessService from "../services/access.service.js";

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(req.body);
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (err) {
      next(err);
    }
  };
}

export default new AccessController();
