import { BadRequestError } from "../core/error.response.js";
import { cat, dog, pet } from "../models/pet.model.js";

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
  }) {
    this.pet_name = pet_name;
    this.pet_thumb = pet_thumb;
    this.pet_price = pet_price;
    this.pet_quantity = pet_quantity;
    this.pet_type = pet_type;
    this.pet_attributes = pet_attributes;
    this.pet_descripton = pet_descripton;
  }

  async createPet(pet_id) {
    return await pet.create({ ...this, _id: pet_id });
  }
}

class Cat extends PetGeneral {
  async createPet() {
    const newCat = await cat.create(this.pet_attributes);
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
    const newDog = await dog.create(this.pet_attributes);
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
