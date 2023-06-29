import { cat, dog, pet } from "../models/pet.model.js";
import User from "../models/user.model.js";

class PetFactory {
  static async createPet(type, payload) {
    switch (type) {
      case "Cat":
        return new Cat(payload).createPet();
      case "Dog":
        return new Dog(payload).createPet();
      default:
        throw new Error(`Invalid pet type ${type}`);
    }
  }

  static async findAllDraft({ pet_admin }) {
    const draftFound = await pet
      .find({ pet_admin, isDraft: true })
      // .populate("pet_admin", "name email")
      .sort({ updateAt: -1 })
      .skip(0)
      .limit(20)
      .lean()
      .exec();
    return draftFound;
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
      throw new Error("Create new cat error");
    }
    const newPet = await super.createPet(newCat._id);
    if (!newPet) {
      throw new Error("Create new pet error");
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
      throw new Error("Create new dog error");
    }
    const newPet = await super.createPet(newDog._id);
    if (!newPet) {
      throw new Error("Create new pet error");
    }
    return newPet;
  }
}

class PetController {
  createPet = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    await PetFactory.createPet(req.body.pet_type, {
      ...req.body,
      pet_admin: user._id,
    });
    res.send("Create pet success");
  };

  findAllDraft = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    const draftPets = await PetFactory.findAllDraft({ pet_admin: user._id });
    res.send(draftPets);
  };
}
export default new PetController();
