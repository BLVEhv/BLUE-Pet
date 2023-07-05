import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";
import PetController from "../controllers/pet.controller.js";
import ProductController from "../controllers/product.controller.js";
import CartController from "../controllers/cart.controller.js";

const adminRouter = Router();

//adminUser
adminRouter.get("/user/", AdminController.getAllUser);

adminRouter.get("/user/:id", AdminController.getUserById);

adminRouter.put("/user/:id", AdminController.banUserById);

//admin
adminRouter.put("/:id", AdminController.resetPasswordById);
//create pet
adminRouter.post("/create-pet", PetController.createPet);
//create product
adminRouter.post("/create-product", ProductController.createProduct);
//get all draft pet
adminRouter.get("/draft-pet", PetController.findAllDraft);
//get all draft product
adminRouter.get("/draft-product", ProductController.findAllDraft);
//publish draft pet
adminRouter.put("/draft-pet/:id", PetController.publishDraftById);
//publish draft product
adminRouter.put("/draft-product/:id", ProductController.publishDraftById);
//unpublish pet
adminRouter.put(
  "/un-publish-product/:id",
  ProductController.unPublishDraftById
);
//unpublish product
adminRouter.put(
  "/un-publish-product/:id",
  ProductController.unPublishDraftById
);
//update pet
adminRouter.patch("/pet/:id", PetController.updatePet);
//update product
adminRouter.patch("/product/:id", ProductController.updateProduct);

//get list cart
adminRouter.get("/cart", CartController.getListUserCart);
export default adminRouter;
