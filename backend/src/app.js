import express from "express";
// const path = require("path");
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import cors from "cors";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    //origin: process.env.CORS_ORIGIN,
    origin: [
      "https://momento-frontend.vercel.app",
      "https://project-momento.netlify.app",
    ],
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import postRouter from "./routes/post.routes.js";
import { ApiError } from "./utils/ApiError.js";
app.use("/api/v1/posts", postRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(function (err, req, res, next) {
  console.log("ERROR: ", err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send({ error: err.message });
});

export { app };
