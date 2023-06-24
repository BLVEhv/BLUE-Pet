"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DOCUMENT_NAME = "pet";
const COLLECTION_NAME = "pets";

// Declare the Schema of the Mongo model
const petSchema = new mongoose.Schema(
  {
    pet_name: { type: String, default: "", required: true },
    pet_thumb: { type: String, default: "", required: true },
    pet_price: { type: Number, default: "", required: true },
    pet_quantity: { type: Number, default: "", required: true },
    pet_descripton: String,
    pet_type: {
      type: String,
      default: "",
      required: true,
      enum: ["Cat", "Dog"],
    },
    pet_attributes: { type: Schema.Types.Mixed, default: "", required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

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
