import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    commenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("POST", postSchema);
export const Comment = mongoose.model("COMMENT", commentSchema);
