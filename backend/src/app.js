import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, '..', 'public', 'build')));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import postRouter from "./routes/post.routes.js";
app.use("/api/v1/posts", postRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'build', 'index.html'));
});

app.use(function (err, req, res, next) {
  console.log("ERROR: ", err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send({ error: err.message });
});

export { app };
