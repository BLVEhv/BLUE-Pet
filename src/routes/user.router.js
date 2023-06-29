import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import PetController from "../controllers/pet.controller.js";

const userRouter = Router();

//change password
userRouter.put("/", UserController.changePassword);
//
userRouter.get("/", PetController.findAllPublish);
export default userRouter;
