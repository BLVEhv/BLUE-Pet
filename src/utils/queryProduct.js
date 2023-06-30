import { product } from "../models/product.model.js";

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

export default queryProduct;
