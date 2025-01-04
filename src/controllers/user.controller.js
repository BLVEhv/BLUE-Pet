"use strict";

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.util.js";
import jwt from "jsonwebtoken";

class UserController {
  changePassword = async (req, res, next) => {
    try {
      const userEmail = req.user.email;
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

  forgetPassword = async (req, res, next) => {
    const generateRefreshToken = (user) =>
      jwt.sign({ user }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send("User with given email doesn't exist");
      }
      const refreshToken = generateRefreshToken({
        email: user.email,
        password: user.password,
      });
      await User.findByIdAndUpdate(
        { _id: user._id },
        {
          $set: {
            refreshToken,
          },
        },
        { upsert: true, new: true }
      );
      const link = `${process.env.BASE_URL}/password-reset/${user._id}/${refreshToken}`;
      await sendEmail(user.email, "Password reset", link);

      res.send("Password reset link sent to your email account");
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const user = await User.findById({ _id: req.params.id });
      if (!user) return res.status(400).send("Invalid link or expired");
      if (user.refreshToken !== req.params.token) {
        res.status(400).send("Invalid link or expired");
      }
      const { password, verifyPassword } = req.body;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(verifyPassword, salt);
      if (password !== verifyPassword) {
        throw new Error("Password and verifyPassword is not match");
      } else {
        await User.findByIdAndUpdate(
          { _id: user._id },
          { password: hashedPassword },
          {
            new: true,
            upsert: true,
          }
        );
      }
      res.send("password reset sucessfully.");
    } catch (err) {
      next(err);
    }
  };
}

export default new UserController();
