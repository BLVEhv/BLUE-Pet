import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import PetController from "../controllers/pet.controller.js";
import ProductController from "../controllers/product.controller.js";

const userRouter = Router();

//change password
userRouter.put("/", UserController.changePassword);
//
userRouter.get("/pet", PetController.findAllPublish);

userRouter.get("/pet/:id", PetController.getDetailPetById);

userRouter.get("/product", ProductController.findAllPublish);

userRouter.get("/product/:id", ProductController.getDetailProductById);

export default userRouter;
