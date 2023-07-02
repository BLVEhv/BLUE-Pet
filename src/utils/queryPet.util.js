import { pet } from "../models/pet.model.js";
import { getSelectData, unGetSelectData } from "./index.js";

const findAllPublishPet = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await pet
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};

const getDetailPet = async ({ id, unselect }) => {
  return await pet.findById({ _id: id }).select(unGetSelectData(unselect));
};

const queryPet = async ({ query, limit, skip }) => {
  return await pet
    .find(query)
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

export { queryPet, findAllPublishPet, getDetailPet };
