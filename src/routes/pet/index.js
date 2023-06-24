"use strict";

import express from "express";
import petController from "../../controllers/pet.controller.js";
const routerPet = express.Router();

//create admin
routerPet.post("/create-pet", petController.createPet);

export default routerPet;
