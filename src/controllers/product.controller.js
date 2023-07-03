import inventory from "../models/inventory.model.js";
import { accessory, food, product, sand } from "../models/product.model.js";
import User from "../models/user.model.js";
import {
  removeUndefinedObject,
  updateNestedObjectParser,
} from "../utils/index.js";
import {
  queryProduct,
  findAllPublish,
  getDetailProduct,
  updateProductById,
} from "../utils/queryProduct.js";

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Food":
        return new Food(payload).createProduct();
      case "Sand":
        return new Sand(payload).createProduct();
      case "Accessory":
        return new Accessory(payload).createProduct();
      default:
        throw new Error(`Invalid product type ${type}`);
    }
  }

  static async updateProduct(type, product_id, payload) {
    switch (type) {
      case "Food":
        return new Food(payload).updateProduct(product_id);
      case "Sand":
        return new Sand(payload).updateProduct(product_id);
      case "Accessory":
        return new Accessory(payload).updateProduct(product_id);
      default:
        throw new Error(`Invalid product type ${type}`);
    }
  }

  static async findAllDraft({ product_admin, limit = 20, skip = 0 }) {
    const query = { product_admin, isDraft: true };
    return await queryProduct({ query, limit, skip });
  }

  static async findAllPublish({
    limit = 20,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
  }) {
    return await findAllPublish({
      limit,
      sort,
      filter,
      page,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async getDetailProductById({ id }) {
    return await getDetailProduct({
      id,
      unselect: ["__v", "product_variations"],
    });
  }

  static async publishDraftById({ product_admin, id }) {
    const draftFound = await product.findOne({
      product_admin: product_admin,
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

  static async unPublishDraftById({ product_admin, id }) {
    const publishFound = await product.findOne({
      product_admin: product_admin,
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

  static async searchProductByName({ keySearch }) {
    const regexSearch = new RegExp(keySearch);
    const results = await product
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

class ProductGeneral {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_quantity,
    product_type,
    product_attributes,
    product_descripton,
    product_admin,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
    this.product_descripton = product_descripton;
    this.product_admin = product_admin;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      return await inventory.create({
        _id: product_id,
        inven_stock: this.product_quantity,
      });
    }
    return newProduct;
  }

  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById({ product_id, bodyUpdate, model: product });
  }
}

class Food extends ProductGeneral {
  async createProduct() {
    const newFood = await food.create({
      ...this.product_attributes,
      product_admin: this.product_admin,
    });
    if (!newFood) {
      throw new Error("Create new food error");
    }
    const newProduct = await super.createProduct(newFood._id);
    if (!newProduct) {
      throw new Error("Create new product error");
    }
    return newProduct;
  }

  async updateProduct(product_id) {
    //remove undefined value
    const objectParams = removeUndefinedObject(this);
    //check update position
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: food,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Sand extends ProductGeneral {
  async createProduct() {
    const newSand = await dog.create({
      ...this.product_attributes,
      product_admin: this.product_admin,
    });
    if (!newSand) {
      throw new Error("Create new sand error");
    }
    const newProduct = await super.createProduct(newSand._id);
    if (!newProduct) {
      throw new Error("Create new product error");
    }
    return newProduct;
  }

  async updateProduct(product_id) {
    //remove undefined value
    const objectParams = removeUndefinedObject(this);
    //check update position
    if (objectParams.product_attributes) {
      await updatePetById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: sand,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Accessory extends ProductGeneral {
  async createProduct() {
    const newAccessory = await dog.create({
      ...this.product_attributes,
      product_admin: this.product_admin,
    });
    if (!newAccessory) {
      throw new Error("Create new accessory error");
    }
    const newProduct = await super.createProduct(newAccessory._id);
    if (!newProduct) {
      throw new Error("Create new product error");
    }
    return newProduct;
  }

  async updateProduct(product_id) {
    //remove undefined value
    const objectParams = removeUndefinedObject(this);
    //check update position
    if (objectParams.product_attributes) {
      await updatePetById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: accessory,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class ProductController {
  createProduct = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    await ProductFactory.createProduct(req.body.product_type, {
      ...req.body,
      product_admin: user._id,
    });
    res.send("Create product success");
  };

  findAllDraft = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    const draftProducts = await ProductFactory.findAllDraft({
      product_admin: user._id,
    });
    res.send(draftProducts);
  };

  findAllPublish = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    const publishProduct = await ProductFactory.findAllPublish({
      product_admin: user._id,
    });
    res.send(publishProduct);
  };

  publishDraftById = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    await ProductFactory.publishDraftById({
      product_admin: user._id,
      id: req.params.id,
    });
    res.send("Publish success");
  };

  unPublishDraftById = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    await ProductFactory.unPublishDraftById({
      product_admin: user._id,
      id: req.params.id,
    });
    res.send("unPublish success");
  };

  searchProductByName = async (req, res, next) => {
    const productFound = await ProductFactory.searchProductByName(req.params);
    res.send(productFound);
  };

  getDetailProductById = async (req, res, next) => {
    const detailProduct = await ProductFactory.getDetailProductById({
      id: req.params.id,
    });
    res.send(detailProduct);
  };

  updateProduct = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    await ProductFactory.updateProduct(req.body.product_type, req.params.id, {
      ...req.body,
      product_admin: user._id,
    });
    res.send("Update product success");
  };
}
export default new ProductController();
