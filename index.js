import { config } from "dotenv";
import express from "express";

import { connectDB } from "./db/database.js";
import authRoute from "./routes/auth.js";
import jobsRoute from "./routes/jobs.js";
import userRoute from "./routes/user.js";
import HttpStatus from "./utils/HttpStatus.js";

config();
const app = express();
const port = process.env.PORT || 8000;

// Steup
app.use(express.json());

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

// Routes
app.use("/auth", authRoute);
app.use("/", jobsRoute);
app.use("/user", userRoute);

// Error Handling
app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const msg = error.message;
  const data = error.data;
  res.status(status).json({
    status: HttpStatus.ERROR,
    data: {
      msg,
      data,
    },
  });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening: ${port}`);
    });
  })
  .catch((err) => console.log(err));
