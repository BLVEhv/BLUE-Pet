"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";
import { authentication } from "../../auth/authUtil.js";
const routerAccess = express.Router();

//signUp
routerAccess.post("/shop/signup", accessController.signUp);
//logIn
routerAccess.post("/shop/login", accessController.logIn);
//login admin
routerAccess.post("/shop/admin/login", accessController.logInAdmin);
//authentication
routerAccess.use(authentication);
//logOut
routerAccess.post("/shop/logout", accessController.logOut);

export default routerAccess;
