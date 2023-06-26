import { Types } from "mongoose";
import { BadRequestError } from "../core/error.response.js";
import { cat, dog, pet } from "../models/pet.model.js";
import { findAllDraft } from "../models/repositories/pet.repo.js";

class PetFactory {
  static petRegistry = {};

  static registerPetType(type, classRef) {
    PetFactory.petRegistry[type] = classRef;
  }

  static async createPet(type, payload) {
    const petClass = PetFactory.petRegistry[type];
    if (!petClass) {
      throw new BadRequestError("Invalid pet types");
    }
    return new petClass(payload).createPet();
  }

  static async findAllDraftForAdmin(pet_admin, limit = 20, skip = 0) {
    console.log(pet_admin.pet_admin.adminId);
    // const petAdminId = pet_admin.pet_admin.adminId;
    const query = { pet_admin: pet_admin.pet_admin.adminId, isDraft: true };
    // console.log("", petAdminId);
    return await findAllDraft({ query, limit, skip });
  }
}

class PetGeneral {
  constructor({
    pet_name,
    pet_thumb,
    pet_price,
    pet_quantity,
    pet_type,
    pet_attributes,
    pet_descripton,
    pet_admin,
  }) {
    this.pet_name = pet_name;
    this.pet_thumb = pet_thumb;
    this.pet_price = pet_price;
    this.pet_quantity = pet_quantity;
    this.pet_type = pet_type;
    this.pet_attributes = pet_attributes;
    this.pet_descripton = pet_descripton;
    this.pet_admin = pet_admin;
  }

  async createPet(pet_id) {
    return await pet.create({ ...this, _id: pet_id });
  }
}

class Cat extends PetGeneral {
  async createPet() {
    const newCat = await cat.create({
      ...this.pet_attributes,
      pet_admin: this.pet_admin,
    });
    if (!newCat) {
      throw new BadRequestError("Create new cat error");
    }
    const newPet = await super.createPet(newCat._id);
    if (!newPet) {
      throw new BadRequestError("Create new pet error");
    }
    return newPet;
  }
}

class Dog extends PetGeneral {
  async createPet() {
    const newDog = await dog.create({
      ...this.pet_attributes,
      pet_admin: this.pet_admin,
    });
    if (!newDog) {
      throw new BadRequestError("Create new dog error");
    }
    const newPet = await super.createPet(newDog._id);
    if (!newPet) {
      throw new BadRequestError("Create new pet error");
    }
    return newPet;
  }
}

PetFactory.registerPetType("Cat", Cat);
PetFactory.registerPetType("Dog", Dog);

export default PetFactory;
