"use strict";

import mongoose from "mongoose";

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

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
    cart_userId: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export const cart = mongoose.model(DOCUMENT_NAME, CartSchema);
