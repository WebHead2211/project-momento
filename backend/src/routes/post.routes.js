import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  deleteComment,
  deletePost,
  getComment,
  getComments,
  getPost,
  homeFeed,
  newComment,
  newPost,
} from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.route("/getPost/:id").get(getPost);
postRouter.route("/getComment/:id").get(getComment);
postRouter.route("/getComments/:id/:page").get(getComments);

//secured routes
postRouter.route("/post").post(
  verifyJWT,
  upload.fields([
    {
      name: "postImage",
      maxCount: 1,
    },
  ]),
  newPost
);
postRouter.route("/newComment").post(verifyJWT, newComment);
postRouter.route("/deleteComment/:id").delete(verifyJWT, deleteComment);
postRouter.route("/homeFeed/:page").get(verifyJWT, homeFeed);
postRouter.route("/deletePost/:id").delete(verifyJWT, deletePost);

export default postRouter;
