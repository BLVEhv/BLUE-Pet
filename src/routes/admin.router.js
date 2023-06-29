import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";
import PetController from "../controllers/pet.controller.js";

const adminRouter = Router();

//adminUser
adminRouter.get("/user/", AdminController.getAllUser);

adminRouter.get("/user/:id", AdminController.getUserById);

adminRouter.put("/user/:id", AdminController.banUserById);

//admin
adminRouter.put("/:id", AdminController.resetPasswordById);
//create pet
adminRouter.post("/create-pet", PetController.createPet);
//get all draft
adminRouter.get("/draft", PetController.findAllDraft);
//publish draft
adminRouter.put("/draft/:id", PetController.publishDraftById);
export default adminRouter;
