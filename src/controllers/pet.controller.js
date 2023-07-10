import { cat, dog, pet } from "../models/pet.model.js";
import User from "../models/user.model.js";
import {
  removeUndefinedObject,
  updateNestedObjectParser,
} from "../utils/index.js";
import {
  queryPet,
  findAllPublishPet,
  getDetailPet,
  updatePetById,
} from "../utils/queryPet.util.js";
import multer from "multer";
import path from "path";
import appRootPath from "app-root-path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRootPath + "/src/public/image/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
});

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
      throw new Error("Draft does not exist");
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
      throw new Error("Publish does not exist");
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

  static async updatePet(type, pet_Id, payload) {
    switch (type) {
      case "Cat":
        return new Cat(payload).updatePet(pet_Id);
      case "Dog":
        return new Dog(payload).updatePet(pet_Id);
      default:
        throw new Error(`Invalid pet type ${type}`);
    }
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

  async updatePet(pet_id, bodyUpdate) {
    return await updatePetById({ pet_id, bodyUpdate, model: pet });
  }
}

class Cat extends PetGeneral {
  async createPet() {
    const newCat = await cat.create({
      ...this.pet_attributes,
      pet_admin: this.pet_admin,
      pet_thumb: this.pet_thumb,
    });
    if (!newCat) {
      throw new Error("Error creating a new cat");
    }
    const newPet = await super.createPet(newCat._id);
    if (!newPet) {
      throw new Error("Error creating a new pet");
    }
    return newPet;
  }

  async updatePet(pet_id) {
    //remove undefined value
    const objectParams = removeUndefinedObject(this);
    //check update position
    if (objectParams.pet_attributes) {
      await updatePetById({
        pet_id,
        bodyUpdate: updateNestedObjectParser(objectParams.pet_attributes),
        model: cat,
      });
    }

    const updatePet = await super.updatePet(
      pet_id,
      updateNestedObjectParser(objectParams)
    );
    return updatePet;
  }
}

class Dog extends PetGeneral {
  async createPet() {
    const newDog = await dog.create({
      ...this.pet_attributes,
      pet_admin: this.pet_admin,
      pet_thumb: this.pet_thumb,
    });
    if (!newDog) {
      throw new Error("Error creating a new dog");
    }
    const newPet = await super.createPet(newDog._id);
    if (!newPet) {
      throw new Error("Error creating a new pet");
    }
    return newPet;
  }

  async updatePet(pet_id) {
    //remove undefined value
    const objectParams = removeUndefinedObject(this);
    //check update position
    if (objectParams.pet_attributes) {
      await updatePetById({
        pet_id,
        bodyUpdate: updateNestedObjectParser(objectParams.pet_attributes),
        model: dog,
      });
    }

    const updatePet = await super.updatePet(
      pet_id,
      updateNestedObjectParser(objectParams)
    );
    return updatePet;
  }
}

class PetController {
  constructor() {
    this.uploadMiddleware = upload.single("pet_thumb");
  }
  createPet = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.user.email });

      this.uploadMiddleware(req, res, async (err) => {
        if (err) {
          // Xử lý lỗi tải lên tệp tin
          return next(err);
        }

        await PetFactory.createPet(req.body.pet_type, {
          ...req.body,
          pet_admin: user._id,
          pet_thumb: req.file.filename,
        });

        res.send("Create pet success");
      });
    } catch (error) {
      next(error);
    }
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

  updatePet = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    this.uploadMiddleware(req, res, async (err) => {
      if (err) {
        // Xử lý lỗi tải lên tệp tin
        return next(err);
      }

      const petType = req.body.pet_type;
      const petId = req.params.id;
      const updatedFields = {
        ...req.body,
        pet_admin: user._id,
      };

      // Kiểm tra nếu có tệp tin được tải lên
      if (req.file) {
        updatedFields.pet_thumb = req.file.filename;
      }

      await PetFactory.updatePet(petType, petId, updatedFields);
      res.send("Update pet success");
    });
  };
}
export default new PetController();
