import { pet } from "../pet.model.js";

const findAllDraft = async ({ query, limit, skip }) => {
  return await pet
    .find(query)
    .populate("pet_admin", "username")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

export { findAllDraft };
