"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";
const routerAccess = express.Router();

//signUp
routerAccess.post("/shop/signup", accessController.signUp);
//logIn
routerAccess.post("/shop/login", accessController.logIn);
//login admin
routerAccess.post("/shop/admin/login", accessController.logInAdmin);

export default routerAccess;
