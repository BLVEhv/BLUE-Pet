"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";
const routerAccess = express.Router();

//signUp
routerAccess.post("/signup", accessController.signUp);
//logIn
routerAccess.post("/login", accessController.logIn);
//login admin
routerAccess.post("/admin/login", accessController.logInAdmin);

export default routerAccess;
