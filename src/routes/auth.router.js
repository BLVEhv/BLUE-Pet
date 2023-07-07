import bcrypt from "bcryptjs";
import passport from "../configs/passport.js";
import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import UserController from "../controllers/user.controller.js";

const authRouter = Router();

const generateAccessToken = (user) =>
  jwt.sign({ user }, process.env.SECRET, { expiresIn: "30s" });
const generateRefreshToken = (user) =>
  jwt.sign({ user }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

authRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    console.log(req.user);
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);
    await User.updateOne(
      { email: req.user.email },
      {
        $set: {
          refreshToken,
        },
      }
    );
    res.json({ accessToken, refreshToken });
  }
);

authRouter.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }
    const {
      user: { email },
    } = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User is not found");
    }
    if (user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }
    const accessToken = generateAccessToken({ email, roles: user.roles });
    const newRefreshToken = generateRefreshToken({ email, roles: user.roles });
    await User.updateOne(
      { email },
      {
        $pull: {
          refreshToken,
        },
      }
    );
    await User.updateOne(
      { email },
      {
        $set: {
          refreshToken: newRefreshToken,
        },
      }
    );
    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Failed to refresh token" });
  }
});

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, verifyPassword, name, age, address, dob } =
      req.body;
    if (!email || !password || !verifyPassword) {
      throw new Error("Email and passwords are required");
    }
    if (password !== verifyPassword) {
      throw new Error("Passwords do not match");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ msg: "User already exists" });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      name,
      age,
      address,
      dob,
      password: hashedPassword,
      salt,
    });
    if (process.env.ADMIN_EMAIL === newUser.email) {
      newUser.roles.push("admin");
    }
    await newUser.save();
    return res.status(201).json({ msg: "Registration successful" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "Failed to register user" });
  }
});

authRouter.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/redirect",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const accessToken = generateAccessToken(req.user);
      const newRefreshToken = generateRefreshToken(req.user);
      await User.updateOne(
        { email: req.user.email },
        { $set: { refreshToken: newRefreshToken } }
      );
      return res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.error("Error creating token:", error);
      return res.status(500).json({ message: "Error creating token" });
    }
  }
);

//logout
authRouter.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email } = req.user;
    const { refreshToken } = req.body;
    await User.updateOne({ email }, { $pull: { refreshToken } });
    try {
      res.status(200).send({ msg: "Logout successful." });
    } catch (error) {
      res.status(500).send({ msg: error.messages });
    }
  }
);

//forget password
authRouter.post("/forget-password", UserController.forgetPassword);
//reset password user
authRouter.post("/:id/:token", UserController.resetPassword);

export default authRouter;
