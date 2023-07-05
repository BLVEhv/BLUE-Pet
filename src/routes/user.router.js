import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import PetController from "../controllers/pet.controller.js";
import ProductController from "../controllers/product.controller.js";
import CartController from "../controllers/cart.controller.js";

const userRouter = Router();

//change password
userRouter.put("/", UserController.changePassword);
//
userRouter.get("/pet", PetController.findAllPublish);

userRouter.get("/pet/:id", PetController.getDetailPetById);

userRouter.get("/product", ProductController.findAllPublish);

userRouter.get("/product/:id", ProductController.getDetailProductById);

//add cart
userRouter.post("/cart", CartController.addToCart);
//update cart
userRouter.put("/cart/update", CartController.updateToCart);
//delete cart
userRouter.delete("/cart", CartController.deleteFromCart);

export default userRouter;
