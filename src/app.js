import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { connect } from "./configs/connectDB.js";
import "dotenv/config";
import authRouter from "./routes/auth.router.js";
import checkRoleMiddleware from "./middleware/role.js";
import adminRouter from "./routes/admin.router.js";
import passport from "passport";
import userRouter from "./routes/user.router.js";
import PetController from "./controllers/pet.controller.js";

const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init db
connect();

//init route
app.get("/search/:keySearch", PetController.searchPetByName);

app.use("/auth", authRouter);

app.get(
  "/test",
  checkRoleMiddleware(["user"]),
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "Hello" });
  }
);

app.use(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  checkRoleMiddleware(["admin"]),
  adminRouter
);

app.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  checkRoleMiddleware(["user"]),
  userRouter
);

//handling error
app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal server error!",
  });
});

export default app;
