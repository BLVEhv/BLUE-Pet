import { pet } from "../models/pet.model.js";

const queryPet = async ({ query, limit, skip }) => {
  return await pet
    .find(query)
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

export default queryPet;
