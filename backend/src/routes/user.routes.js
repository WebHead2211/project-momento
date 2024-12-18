import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  toggleFollow,
  getCurrentUser,
  getUser,
  toggleLike,
  getUpdatedFollowers,
  getUserByUsername,
  editUser,
  search,
  followSuggestions,
  deleteUser,
  getNotification,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);
userRouter.route("/refreshToken").post(refreshAccessToken);
userRouter.route("/getUser/:id").get(getUser);
userRouter.route("/getUsername/:username").get(getUserByUsername);
userRouter.route("/search/:text").get(search);
userRouter.route("/getNotification/:id").get(getNotification);

//secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/toggleFollow/:followUsername").post(verifyJWT, toggleFollow);
userRouter.route("/toggleLike/:postId").post(verifyJWT, toggleLike);
userRouter.route("/currentUser").get(verifyJWT, getCurrentUser);
userRouter.route("/getUpdatedFollowers").get(verifyJWT, getUpdatedFollowers);
userRouter.route("/suggestions").get(verifyJWT, followSuggestions);
userRouter.route("/editUser").patch(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  editUser
);
userRouter.route("/deleteUser").delete(verifyJWT, deleteUser);
userRouter.route("/deleteNotification").delete(verifyJWT, deleteNotification);
userRouter
  .route("/clearNotifications")
  .delete(verifyJWT, deleteAllNotifications);

export default userRouter;
