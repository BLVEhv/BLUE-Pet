import { product } from "../models/product.model.js";
import { getSelectData, unGetSelectData } from "./index.js";

const findAllPublish = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const getDetailProduct = async ({ id, unselect }) => {
  return await product.findById({ _id: id }).select(unGetSelectData(unselect));
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const updateProductById = async ({
  product_id,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate({ _id: product_id }, bodyUpdate, {
    new: isNew,
  });
};

export { queryProduct, findAllPublish, getDetailProduct, updateProductById };
