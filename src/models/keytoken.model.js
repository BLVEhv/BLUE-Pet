"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DOCUMENT_NAME = "key";
const COLLECTION_NAME = "keys";

// Declare the Schema of the Mongo model
const keyTokenSchema = new mongoose.Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
export const keyTokenModel = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
