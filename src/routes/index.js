"use strict";

import express from "express";
const router = express.Router();
import routerAccess from "./access/index.js";
import routerUser from "./user/index.js";
import routerAdmin from "./admin/index.js";
import { authentication } from "../auth/authUtil.js";
import adminAuthentication from "../auth/admin.auth.js";

router.use("/v1/api/shop", routerAccess);
router.use("/v1/api/user", authentication, routerUser);
router.use("/v1/api/admin", adminAuthentication, routerAdmin);
export default router;
