"use strict";

import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const InventorySchema = new Schema(
  {
    inven_stock: { type: Number, required: true },
    inven_reservation: { type: Array, default: [] },
  },
  {
    timeseries: true,
    collection: COLLECTION_NAME,
  }
);

const inventory = model(DOCUMENT_NAME, InventorySchema);

export default inventory;
