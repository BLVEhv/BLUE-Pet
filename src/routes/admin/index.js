"use strict";

import express from "express";
import { authentication } from "../../auth/authUtil.js";
import AdminController from "../../controllers/admin.controller.js";
import accessController from "../../controllers/access.controller.js";
const routerAdmin = express.Router();

// //authentication
// routerAdmin.use(authentication);
//changepPassword
// routerAdmin.post("/admin/login", accessController.logInAdmin);

export default routerAdmin;
