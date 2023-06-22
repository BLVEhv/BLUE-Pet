import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { SuccessResponse } from "../core/success.response.js";
import { User } from "../models/user.model.js";
import getInfoData from "../utils/index.js";
import bcrypt from "bcrypt";

const findByUsername = async ({ username }) => {
  return await User.findOne({ username });
};
const userChangePassword = async (
  clientId,
  { password, newPassword, verifyNewPassword }
) => {
  const userFound = await User.findOne({ _id: clientId });
  if (!userFound) {
    throw new AuthFailureError("Unauthorization");
  }
  try {
    const matchPassword = await bcrypt.compare(password, userFound.password);

    if (!matchPassword) {
      throw new BadRequestError("The older password is not correct");
    } else {
      if (newPassword !== verifyNewPassword) {
        throw new BadRequestError(
          "New password and verify new password is not match"
        );
      } else {
        const userUpdate = await User.findOneAndUpdate(
          userFound._id,
          {
            password: await bcrypt.hash(verifyNewPassword, 10),
          },
          { upsert: true, new: true }
        );
        if (userUpdate) {
          throw new SuccessResponse("Update password successfully");
        } else {
          throw new BadRequestError("Update password failed");
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  return {
    user: getInfoData({
      fields: ["_id", "username", "email"],
      object: userFound,
    }),
  };
};

export { findByUsername, userChangePassword };
