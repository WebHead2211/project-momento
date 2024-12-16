import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { AddComment } from "./AddComment";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/HomePost.css";

export default function HomePost({ post, setPreviewPost, previewPost }) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [postUser, setPostUser] = useState();
  const [date, setDate] = useState();
  const [like, setLike] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  //Get the user of this post
  useEffect(() => {
    const getPostUser = async () => {
      try {
        const response = await axios.get(`/api/v1/users/getUser/${post.user}`);
        setPostUser(response.data.data);
      } catch (error) {
        navigate("/error", { state: { error: error.response.data.error } });
      }
    };
    getPostUser();
    let newDate = new Date(post.createdAt);
    setDate(newDate.toLocaleDateString("en-GB"));
  }, []);

  //Set the 'like' value if the post is present/not present in current user's liked list
  useEffect(() => {
    if (user) {
      if (user.likedPosts.includes(post._id)) {
        setLike(true);
      } else {
        setLike(false);
      }
    }
  }, [user]);

  //Set the 'like' value if the post is present/not present in current user's liked list
  const checkCurrentUserLikes = async (id) => {
    const response = await axios.get(`/api/v1/users/getUser/${id}`);
    if (response.data.data.likedPosts.includes(post._id)) {
      setLike(true);
    } else {
      setLike(false);
    }
  };

  //Get the current post updated version from db
  const getCurrentPost = async (id) => {
    const response = await axios.get(`/api/v1/posts/getPost/${id}`);
    setCurrentPost(response.data.data);
  };

  //Toggle like from current user to current post
  const toggleLike = async () => {
    await axios.post(`/api/v1/users/toggleLike/${post._id}`, {
      withCredentials: true,
    });
    checkCurrentUserLikes(user._id);
    getCurrentPost(post._id);
  };

  useEffect(() => {
    getCurrentPost(post._id);
    checkCurrentUserLikes(user._id);
  }, [previewPost]);

  const input = useRef();

  let clickTimer = null;
  let lastTapTime = 0;
  let singleTapTimeout = null;

  const handleTap = () => {
    const currentTime = Date.now();
    const tapGap = currentTime - lastTapTime;

    if (tapGap < 300 && tapGap > 0) {
      clearTimeout(singleTapTimeout);
      toggleLike();
    } else {
      singleTapTimeout = setTimeout(() => {
        setPreviewPost({ post: currentPost, user: postUser });
      }, 300);
    }

    lastTapTime = currentTime;
  };
  return (
    <>
      {postUser && (
        <>
          <div className="post">
            <div className="user">
              <>
                <Link to={`/user/${postUser.username}`}>
                  <div>
                    <img src={postUser.avatar} alt="" className="user-avatar" />
                    <h2>{postUser.username}</h2>
                  </div>
                </Link>
                <div>
                  <h3>{date}</h3>
                </div>
              </>
            </div>
            <div className="image">
              <img
                src={post.url}
                alt=""
                onClick={() => {
                  if (clickTimer) return;
                  clickTimer = setTimeout(() => {
                    setPreviewPost({ post: currentPost, user: postUser });
                    clickTimer = null;
                  }, 250);
                }}
                onDoubleClick={() => {
                  if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                  }
                  toggleLike();
                }}
                onTouchEnd={handleTap}
              />
            </div>
            <div className="stats">
              <div className="icons">
                <div
                  className="btn-like"
                  onClick={(e) => {
                    toggleLike();
                  }}
                >
                  {like ? (
                    <>
                      <i
                        className="fa-solid fa-heart"
                        style={{ color: "red" }}
                      ></i>
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
              <div className="info">
                <ul>
                  {/* {currentPost && (
                    <>
                      <li>{currentPost.likes.length} likes</li>
                    </>
                  )} */}
                  {currentPost && (
                    <>
                      {currentPost.likes.length == 0 ? (
                        <>
                          <li>0 likes</li>
                        </>
                      ) : (
                        <>
                          {currentPost.likes.length == 1 ? (
                            <>
                              <li>1 like</li>
                            </>
                          ) : (
                            <>
                              <li>{currentPost.likes.length} likes</li>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {postUser && (
                    <>
                      <li>
                        <span>{postUser.username}</span> {post.caption}
                      </li>
                    </>
                  )}

                  {currentPost && currentPost.comments.length > 0 && (
                    <>
                      <li
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setPreviewPost({ post: currentPost, user: postUser });
                        }}
                      >
                        View{" "}
                        {currentPost.comments.length > 1
                          ? currentPost.comments.length
                          : ""}{" "}
                        comments
                      </li>
                    </>
                  )}
                  <AddComment
                    post={post}
                    getCurrentPost={getCurrentPost}
                    ref={input}
                  />
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
