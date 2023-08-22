import bodyParser from "body-parser";
import { config } from "dotenv";
import express from "express";

import { connectDB } from "./db/database.js";

config();
const app = express();
const port = process.env.PORT || 8000;

// Steup
app.use(bodyParser.json());

// Cros
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening: ${port}`);
    });
  })
  .catch((err) => console.log(err));
