"use strict";

import AccessService from "../services/access.service.js";
import { OK, CREATED } from "../core/success.response.js";

class AccessController {
  logOutAdmin = async (req, res, next) => {
    try {
      new OK({
        metadata: await AccessService.logOutAdmin(req.keyStoreAdmin),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  logInAdmin = async (req, res, next) => {
    try {
      new OK({
        metadata: await AccessService.logInAdmin(req.body),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  logOut = async (req, res, next) => {
    try {
      new OK({
        metadata: await AccessService.logOut(req.keyStore),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  logIn = async (req, res, next) => {
    try {
      new OK({
        metadata: await AccessService.logIn(req.body),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  signUp = async (req, res, next) => {
    try {
      new OK({
        message: "Registered Successfully",
        metadata: await AccessService.signUp(req.body),
      }).send(res);
    } catch (err) {
      next(err);
    }
  };
}

export default new AccessController();
