import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const userRouter = Router();

//change password
userRouter.put("/", UserController.changePassword);

export default userRouter;
