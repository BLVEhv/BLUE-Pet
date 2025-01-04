"use strict";

import mongoose from "mongoose";

const DOCUMENT_NAME = "cart";
const COLLECTION_NAME = "carts";

const CartSchema = new mongoose.Schema(
  {
    cart_status: {
      type: String,
      required: true,
      enum: ["active, completed, failed, pending"],
      default: "active",
    },
    cart_products: { type: Array, default: [], required: true },
    cart_count_product: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export const cart = mongoose.model(DOCUMENT_NAME, CartSchema);
