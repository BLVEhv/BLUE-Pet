"use strict";

import express from "express";
import AdminController from "../../controllers/admin.controller.js";
import accessController from "../../controllers/access.controller.js";
const routerAdmin = express.Router();

//create admin
routerAdmin.post("/create-admin", AdminController.createAdmin);
//logout
routerAdmin.post("/logout", accessController.logOutAdmin);
//change password
routerAdmin.post("/change-password", AdminController.changePassword);
//reset password
routerAdmin.put("/reset-password/:id", AdminController.resetPassword);
export default routerAdmin;
