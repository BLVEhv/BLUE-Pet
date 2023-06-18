"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";
const routerAccess = express.Router();

routerAccess.post("/shop/signup", accessController.signUp);

export default routerAccess;
