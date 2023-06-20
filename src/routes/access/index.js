"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";
const routerAccess = express.Router();

//signUp
routerAccess.post("/shop/signup", accessController.signUp);
routerAccess.post("/shop/login", accessController.logIn);

export default routerAccess;
