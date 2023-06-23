"use strict";

import express from "express";
const router = express.Router();
import routerAccess from "./access/index.js";
import routerUser from "./user/index.js";
import routerAdmin from "./admin/index.js";

router.use("/v1/api", routerAccess);
router.use("/v1/api", routerUser);
router.use("/v1/api", routerAdmin);
export default router;
