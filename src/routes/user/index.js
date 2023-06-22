"use strict";

import express from "express";
import { authentication } from "../../auth/authUtil.js";
import UserController from "../../controllers/user.controller.js";
const routerUser = express.Router();

//authentication
routerUser.use(authentication);
//changepPassword
routerUser.post("/user/change-password", UserController.changePassword);

export default routerUser;
