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

export default app;
