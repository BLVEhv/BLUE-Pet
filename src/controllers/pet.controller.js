import { cat, dog, pet } from "../models/pet.model.js";
import User from "../models/user.model.js";
import {
  queryPet,
  findAllPublishPet,
  getDetailPet,
} from "../utils/queryPet.util.js";

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

  static async findAllDraft({ pet_admin, limit = 20, skip = 0 }) {
    const query = { pet_admin, isDraft: true };
    return await queryPet({ query, limit, skip });
  }

  static async findAllPublish({
    limit = 20,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
  }) {
    return await findAllPublishPet({
      limit,
      sort,
      filter,
      page,
      select: ["pet_name", "pet_price", "pet_thumb"],
    });
  }

  static async getDetailPetById({ id }) {
    return await getDetailPet({
      id,
      unselect: ["__v", "pet_variations"],
    });
  }

  static async publishDraftById({ pet_admin, id }) {
    const draftFound = await pet.findOne({
      pet_admin: pet_admin,
      _id: id,
    });
    if (!draftFound) {
      throw new Error("Draft is not exist");
    }

    draftFound.isDraft = false;
    draftFound.isPublish = true;
    const { modifiedCount } = await draftFound.updateOne(draftFound);
    return modifiedCount;
  }

  static async unPublishDraftById({ pet_admin, id }) {
    const publishFound = await pet.findOne({
      pet_admin: pet_admin,
      _id: id,
    });
    if (!publishFound) {
      throw new Error("Publish is not exist");
    }

    publishFound.isDraft = true;
    publishFound.isPublish = false;
    const { modifiedCount } = await publishFound.updateOne(publishFound);
    return modifiedCount;
  }

  static async searchPetByName({ keySearch }) {
    const regexSearch = new RegExp(keySearch);
    const results = await pet
      .find(
        {
          isPublish: true,
          $text: { $search: regexSearch },
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .lean();
    return results;
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

  findAllPublish = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    const publishPets = await PetFactory.findAllPublish({
      pet_admin: user._id,
    });
    res.send(publishPets);
  };

  publishDraftById = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    await PetFactory.publishDraftById({
      pet_admin: user._id,
      id: req.params.id,
    });
    res.send("Publish success");
  };

  unPublishDraftById = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    await PetFactory.unPublishDraftById({
      pet_admin: user._id,
      id: req.params.id,
    });
    res.send("unPublish success");
  };

  searchPetByName = async (req, res, next) => {
    const petFound = await PetFactory.searchPetByName(req.params);
    res.send(petFound);
  };

  getDetailPetById = async (req, res, next) => {
    const detailPet = await PetFactory.getDetailPetById({
      id: req.params.id,
    });
    res.send(detailPet);
  };
}
export default new PetController();
