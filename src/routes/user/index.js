"use strict";

import express from "express";
import UserController from "../../controllers/user.controller.js";
import accessController from "../../controllers/access.controller.js";
const routerUser = express.Router();

//logOut
routerUser.post("/logout", accessController.logOut);
//changepPassword
routerUser.post("/change-password", UserController.changePassword);

export default routerUser;
