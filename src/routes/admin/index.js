"use strict";

import express from "express";
import AdminController from "../../controllers/admin.controller.js";
const routerAdmin = express.Router();

//create admin
routerAdmin.post("/create-admin", AdminController.createAdmin);

export default routerAdmin;
