"use strict";

import mongoose from "mongoose";
import slugify from "slugify";

const Schema = mongoose.Schema;

const DOCUMENT_NAME = "pet";
const COLLECTION_NAME = "pets";

// Declare the Schema of the Mongo model
const petSchema = new Schema(
  {
    pet_name: { type: String, default: "", required: true },
    pet_thumb: { type: String, default: "", required: true },
    pet_price: { type: Number, default: "", required: true },
    pet_quantity: { type: Number, default: "", required: true },
    pet_descripton: String,
    pet_admin: {
      type: String,
    },
    pet_slug: String,
    pet_type: {
      type: String,
      default: "",
      required: true,
      enum: ["Cat", "Dog"],
    },
    pet_attributes: { type: Schema.Types.Mixed, default: "", required: true },
    pet_ratingAverage: {
      type: Number,
      default: 4,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be behind 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublish: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

petSchema.pre("save", function (next) {
  this.pet_slug = slugify(this.pet_name, { lower: true });
  next();
});

petSchema.index({ pet_name: "text", pet_descripton: "text" });

const catSchema = new mongoose.Schema(
  {
    generic: { type: String, default: "", required: true },
    size: String,
    color: String,
  },
  {
    collection: "cats",
    timestamps: true,
  }
);

const dogSchema = new mongoose.Schema(
  {
    generic: { type: String, default: "", required: true },
    size: String,
    color: String,
  },
  {
    collection: "dogs",
    timestamps: true,
  }
);

//Export the model
export const pet = mongoose.model(DOCUMENT_NAME, petSchema);
export const cat = mongoose.model("cat", catSchema);
export const dog = mongoose.model("dog", dogSchema);
