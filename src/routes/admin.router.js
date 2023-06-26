import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";

const adminRouter = Router();

//adminUser
adminRouter.get("/user/", AdminController.getAllUser);

adminRouter.get("/user/:id", AdminController.getUserById);

adminRouter.put("/user/:id", AdminController.banUserById);

//admin
adminRouter.put("/", AdminController.changePasswordAdmin);

adminRouter.put("/:id", AdminController.resetPasswordById);
export default adminRouter;
