import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";

export default function PostStats({
  currentPost,
  addComment,
  commentText,
  setCommentText,
  info = true,
}) {
  const [like, setLike] = useState();
  const { user } = useAuthContext();
  const [post, setPost] = useState(currentPost);
  const input = useRef();

  useEffect(() => {
    const initialLike = async () => {
      const response = await axios.get(`/api/v1/users/getUser/${user._id}`);
      if (response.data.data.likedPosts.includes(post._id)) {
        setLike(true);
      } else {
        setLike(false);
      }
    };
    initialLike();
  }, [like]);

  const toggleLike = async () => {
    await axios.post(`/api/v1/users/toggleLike/${post._id}`, {
      withCredentials: true,
    });
    getCurrentUser(user._id);
    getCurrentPost(currentPost._id);
  };

  const getCurrentUser = async (id) => {
    const response = await axios.get(`/api/v1/users/getUser/${id}`);
    if (response.data.data.likedPosts.includes(currentPost._id)) {
      setLike(true);
    } else {
      setLike(false);
    }
  };

  const getCurrentPost = async (id) => {
    const response = await axios.get(`/api/v1/posts/getPost/${id}`);
    setPost(response.data.data);
  };

  useEffect(() => {
    getCurrentPost(post._id);
  }, []);

  return (
    <>
      <div className="icons">
        <div
          className="btn-like"
          onClick={(e) => {
            toggleLike();
          }}
        >
          {like ? (
            <>
              <i className="fa-solid fa-heart" style={{ color: "red" }}></i>
            </>
          ) : (
            <>
              <i className="fa-regular fa-heart"></i>
            </>
          )}
        </div>
        <div className="btn-comment">
          <i
            className="fa-regular fa-comment"
            onClick={() => {
              input.current.focus();
            }}
          ></i>
        </div>
      </div>

      <>
        <div className="info">
          <ul>
            {post && (
              <>
                {post.likes.length == 1 ? (
                  <>
                    <li>1 like</li>
                  </>
                ) : (
                  <>
                    <li>{post.likes.length} likes</li>
                  </>
                )}
              </>
            )}

            <form action="post" className="comment-form" onSubmit={addComment}>
              {info && <img src={user.avatar} alt="" className="user-avatar" />}
              <textarea
                ref={input}
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
          </ul>
        </div>
      </>
    </>
  );
}
