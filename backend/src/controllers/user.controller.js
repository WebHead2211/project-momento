import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { Post } from "../models/post.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false, timestamps: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;
    if (
      [fullName, email, username, password].some(
        (element) => element?.trim() === "" || !element
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(400, "Could not upload avatar on cloudinary");
    }

    const user = await User.create({
      fullName,
      avatar: avatar.url,
      email,
      username: username,
      password,
    });

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    const options = {
      httpOnly: true,
      // secure: true,
      sameSite: "None",
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, createdUser, "User registered successfully!"));
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { loginData, password } = req.body;
    if (!loginData) {
      throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
      $or: [{ email: loginData }, { username: loginData }],
    });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Incorrect password");
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      user._id
    );
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      // secure: true,
      sameSite: "None",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refreshToken: undefined },
      },
      {
        timestamps: false,
      }
    );

    const options = {
      httpOnly: true,
      // secure: true,
      sameSite: "None",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await User.findById(decodedToken?._id);
      if (!user) {
        throw new ApiError(401, "invalid refresh token");
      }
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "invalid/expired refresh token");
      }

      const { accessToken, newRefreshToken } =
        await generateAccessAndRefreshTokens(user._id);

      const options = {
        httpOnly: true,
        // secure: true,
        sameSite: "None",
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed"
          )
        );
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  } catch (error) {
    next(error);
  }
};

const changeCorrectPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Incorrect old password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password has been changed successfully"));
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      req.user._id
    );
    const loggedInUser = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      // secure: true,
      sameSite: "None",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ user: loggedInUser });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(404, "Id required");
    }
    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
    res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username) {
      throw new ApiError(404, "Username required");
    }
    const user = await User.findOne({ username }).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
    res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const toggleFollow = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { followUsername } = req.params;
    if (!followUsername) {
      throw new ApiError(401, "User not found");
    }
    const followUser = await User.findOne({ username: followUsername });
    if (!followUser) {
      throw new ApiError(401, "User not found");
    }
    if (user.following.includes(followUser._id)) {
      user.following = user.following.filter(
        (id) => !id.equals(followUser._id)
      );
      followUser.followers = followUser.followers.filter(
        (id) => !id.equals(user._id)
      );
      await user.save({ validateBeforeSave: false });
      await followUser.save({ validateBeforeSave: false });
      return res
        .status(200)
        .json(new ApiResponse(200, followUser, "user unfollowed successfully"));
    } else {
      user.following = [...user.following, followUser._id];
      followUser.followers = [...followUser.followers, user._id];
      await user.save({ validateBeforeSave: false });
      await followUser.save({ validateBeforeSave: false });
      return res
        .status(200)
        .json(new ApiResponse(200, followUser, "user followed successfully"));
    }
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-refreshToken -password"
    );
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }
    const { postId } = req.params;
    if (!postId) {
      throw new ApiError(401, "Post id required");
    }
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    if (user.likedPosts.includes(post._id)) {
      user.likedPosts = user.likedPosts.filter((id) => !id.equals(post._id));
      post.likes = post.likes.filter((id) => !id.equals(user._id));
      await user.save({ validateBeforeSave: false });
      await post.save({ validateBeforeSave: false });
      return res
        .status(200)
        .json(
          new ApiResponse(200, { post, user }, "Post DISliked successfully")
        );
    } else {
      post.likes.push(user._id);
      user.likedPosts.push(post._id);
      // user.likedPosts = [...user.likedPosts, post._id];
      await user.save({ validateBeforeSave: false });
      await post.save({ validateBeforeSave: false });
      return res
        .status(201)
        .json(new ApiResponse(200, { post, user }, "Post liked successfully"));
    }
  } catch (error) {
    next(error);
  }
};

const getUpdatedFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-refreshToken -password"
    );
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }
    const users = await User.find({ _id: { $in: user.following } }).sort({
      lastPostedAt: "desc",
    });

    return res
      .status(201)
      .json(new ApiResponse(200, users, "Most recent 5 users fetched"));
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(401, "User not found");
    }
    const { username, email, password, fullName } = req.body;
    if (username !== "") {
      user.username = username;
    }
    if (email !== "") {
      user.email = email;
    }
    if (fullName !== "") {
      user.fullName = fullName;
    }
    if (password !== "") {
      user.password = password;
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (avatarLocalPath) {
      const avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar) {
        throw new ApiError(400, "Could not upload avatar on cloudinary");
      }
      const deletedAvatar = await deleteFromCloudinary(user.avatar);
      user.avatar = avatar.url;
    }
    await user.save();

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while editing the user");
    }

    const options = {
      httpOnly: true,
      // secure: true,
      sameSite: "None",
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, createdUser, "User edited successfully!"));
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { text } = req.params;
    const results = await User.find({
      $or: [
        { username: { $regex: text, $options: "i" } },
        { fullName: { $regex: text, $options: "i" } },
      ],
    });
    return res.status(201).json(new ApiResponse(200, results, "success"));
  } catch (error) {
    next(error);
  }
};

const followSuggestions = async (req, res, next) => {
  try {
    const results = await User.aggregate([
      { $match: { username: { $ne: req.user.username } } },
      { $sample: { size: 4 } },
    ]);
    return res.status(200).json(new ApiResponse(200, results, "Results"));
  } catch (error) {
    next(error);
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCorrectPassword,
  getCurrentUser,
  getUser,
  getUserByUsername,
  toggleFollow,
  toggleLike,
  generateAccessAndRefreshTokens,
  getUpdatedFollowers,
  editUser,
  search,
  followSuggestions,
};
