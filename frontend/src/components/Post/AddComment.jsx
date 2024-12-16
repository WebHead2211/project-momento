import axios from "axios";
import { forwardRef, useState } from "react";
import "../../styles/AddComment.css";
import { useNavigate } from "react-router-dom";

export const AddComment = forwardRef(function AddComment(props, ref) {
  const navigate = useNavigate();
  const { post, getCurrentPost } = props;
  const [commentText, setCommentText] = useState("");
  const addComment = async (e) => {
    try {
      e.preventDefault();
      await axios.post(
        "/api/v1/posts/newComment",
        {
          postId: post._id,
          commentText: commentText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setCommentText("");
      getCurrentPost(post._id);
    } catch (error) {
      navigate("/error", { state: { error: error.response.data.error } });
    }
  };
  return (
    <form action="post" className="comment-form" onSubmit={addComment}>
      <textarea
        ref={ref}
        name="comment-text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="new-comment"
        placeholder="Add new comment..."
      />
      <button
        type="submit"
        className={commentText ? "active btn-primary" : "btn-primary"}
      >
        Post
      </button>
    </form>
  );
});
