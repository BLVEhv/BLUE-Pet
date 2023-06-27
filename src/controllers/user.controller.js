"use strict";

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

class UserController {
  changePassword = async (req, res, next) => {
    try {
      const userEmail = req.decode.user.email;
      if (!userEmail) {
        throw new Error("User email is invalid");
      }
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw new Error("User is not found");
      }
      const { password, newPassword, verifyNewPassword } = req.body;
      const salt = await bcrypt.genSalt();
      const hashedNewPassword = await bcrypt.hash(verifyNewPassword, salt);
      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        throw new Error("The old password is incorrect");
      }
      if (newPassword !== verifyNewPassword) {
        throw new Error("New password and verifyPassword do not match");
      } else {
        const userUpdate = await User.findByIdAndUpdate(
          { _id: user._id },
          { password: hashedNewPassword },
          {
            new: true,
            upsert: true,
          }
        );
        res.send(userUpdate);
      }
    } catch (err) {
      next(err);
    }
  };
}

export default new UserController();
