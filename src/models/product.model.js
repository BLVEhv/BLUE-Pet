"use strict";

import mongoose from "mongoose";
import slugify from "slugify";

const Schema = mongoose.Schema;

const DOCUMENT_NAME = "product";
const COLLECTION_NAME = "products";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    product_name: { type: String, default: "", required: true },
    product_thumb: { type: String, default: "", required: true },
    product_price: { type: Number, default: "", required: true },
    product_quantity: { type: Number, default: 0, required: true },
    product_descripton: String,
    product_admin: {
      type: String,
    },
    product_slug: String,
    product_type: {
      type: String,
      default: "",
      required: true,
      enum: ["Food", "Sand", "Accessory"],
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      default: "",
      required: true,
    },
    product_ratingAverage: {
      type: Number,
      default: 4,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be behind 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublish: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

productSchema.index({ product_name: "text", product_descripton: "text" });

const foodSchema = new mongoose.Schema(
  {
    brand: { type: String, default: "", required: true },
    netWeight: Number,
    origin: String,
  },
  {
    collection: "foods",
    timestamps: true,
  }
);

const sandSchema = new mongoose.Schema(
  {
    brand: { type: String, default: "", required: true },
    netWeight: Number,
    orgin: String,
  },
  {
    collection: "sands",
    timestamps: true,
  }
);

const accessorySchema = new mongoose.Schema(
  {
    material: { type: String, default: "", required: true },
    size: String,
    color: String,
  },
  {
    collection: "accessories",
    timestamps: true,
  }
);

//Export the model
export const product = mongoose.model(DOCUMENT_NAME, productSchema);
export const food = mongoose.model("food", foodSchema);
export const sand = mongoose.model("sand", sandSchema);
export const accessory = mongoose.model("accessories", accessorySchema);
