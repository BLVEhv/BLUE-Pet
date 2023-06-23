"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DOCUMENT_NAME = "keyAdmin";
const COLLECTION_NAME = "keyAdmins";

// Declare the Schema of the Mongo model
const keyAdminSchema = new mongoose.Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
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
export const keyAdmin = mongoose.model(DOCUMENT_NAME, keyAdminSchema);
