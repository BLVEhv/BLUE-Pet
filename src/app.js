import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { connect } from "./configs/connectDB.js";
import router from "./routes/index.js";
import "dotenv/config";

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
app.use("/", router);

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
