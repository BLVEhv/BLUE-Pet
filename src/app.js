import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { connect } from "./configs/connectDB.js";
import "dotenv/config";

const app = express();

//init middleware
app.use(morgan);
app.use(helmet);
app.use(compression);

//init db
connect();

export default app;
