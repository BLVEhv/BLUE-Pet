"use strict";

import express from "express";
const router = express.Router();
import routerAccess from "./access/index.js";

router.use("/v1/api", routerAccess);

export default router;
