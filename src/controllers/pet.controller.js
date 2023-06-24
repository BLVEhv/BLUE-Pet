"use strict";

import PetService from "../services/pet.service.js";
import { OK } from "../core/success.response.js";

class PetController {
  createPet = async (req, res, next) => {
    new OK({
      message: "Create new pet success",
      metadata: await PetService.createPet(req.body.pet_type, req.body),
    }).send(res);
  };
}

export default new PetController();
