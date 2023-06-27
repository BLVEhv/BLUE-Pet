"use strict";

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

class AdminController {
  getAllUser = async (req, res, next) => {
    try {
      const users = await User.find({ roles: { $ne: [] } });
      res.send(users);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  getUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User is not found");
      }
      res.send(user);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  banUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { roles: [] },
        { new: true, upsert: true }
      );
      if (!user) {
        throw new Error("User is not found");
      }
      res.send(user);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  createAdmin = async (req, res, next) => {
    try {
      const { email, password, verifyPassword, name, age, address, dob } =
        req.body;
      if (!email || !password || !verifyPassword) {
        throw new Error("Email and passwords are required");
      }
      if (password !== verifyPassword) {
        throw new Error("Passwords do not match");
      }
      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
        return res.status(409).send({ msg: "Admin already exists" });
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const newAdmin = new User({
        email,
        name,
        age,
        address,
        dob,
        password: hashedPassword,
        salt,
      });
      newAdmin.roles.push("admin");
      await newAdmin.save();
      return res.status(201).json({ msg: "Create admin successful" });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ msg: "Failed to create admin" });
    }
  };

  resetPasswordById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash("abc@123", salt);
      if (!user) {
        throw new Error("User is not found");
      }
      const checkAdmin = user.roles.find((item) => item === "admin");
      if (!checkAdmin) {
        throw new Error("User is not admin");
      } else {
        await User.findByIdAndUpdate(
          id,
          { password: hashedPassword },
          { new: true, upsert: true }
        );
        res.status(200).json({ msg: "Reset password success" });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default new AdminController();
