import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";
import PostStats from "./PostStats";
import "../../styles/PostPreview.css";

export default function PostPreview({
  previewPost,
  setPreviewPost,
  setCurrentUser,
  setPosts,
  setLiked,
}) {
  const TitleComment = ({ title = false }) => {
    return (
      <>
        <div className="comment-container">
          <Link to={`/user/${user.username}`}>
            <img
              src={user.avatar}
              alt=""
              className="comment-avatar"
              onClick={() => {
                setPreviewPost(null);
              }}
            />
          </Link>
          <div>
            <p className="comment" style={{ fontWeight: "bold", margin: "0" }}>
              <Link to={`/user/${user.username}`}>{user.username} </Link>
              <span style={{ fontWeight: "normal", marginLeft: "10px" }}>
                {!title && previewPost.post.caption}
              </span>
            </p>
            <p className="comment-date">
              {!title &&
                new Date(previewPost.post.createdAt).toLocaleDateString(
                  "en-GB"
                )}
            </p>
          </div>
        </div>
      </>
    );
  };
  const [user, setUser] = useState();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [commentsFetched, setCommentsFetched] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loader, setLoader] = useState("");
  const commentList = useRef();
  const getComments = async () => {
    const response = await axios.get(
      `/api/v1/posts/getComments/${previewPost.post._id}/${page}`
    );
    if (response.data.data.length > 0) {
      setComments((prev) => {
        return [...prev, ...response.data.data];
      });
    } else {
      setCommentsFetched(true);
    }
  };
  useEffect(() => {
    if (!commentsFetched) {
      getComments();
    }
  }, [page]);

  const getPostUser = async () => {
    const response = await axios.get(
      `/api/v1/users/getUser/${previewPost.post.user}`
    );
    setUser(response.data.data);
  };

  useEffect(() => {
    getPostUser();
  }, []);

  const addComment = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "/api/v1/posts/newComment",
        {
          postId: previewPost.post._id,
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
      setCommentsFetched(false);
      setComments([]);
      setPage(0);
      getComments();
    } catch (error) {
      navigate("/error", { state: { error: error.response.data.error } });
    }
  };
  const navigate = useNavigate();

  return (
    <>
      {user && (
        <>
          <div className="postPreview-container">
            <button
              className="btn-secondary btn-close"
              onClick={async () => {
                // navigate(0);
                if (setPosts && setLiked && setCurrentUser) {
                  setPosts([]);
                  setLiked([]);
                  const response = await axios.get(
                    `/api/v1/users/getUser/${previewPost.user._id}`
                  );
                  setCurrentUser(response.data.data);
                }
                setPreviewPost(null);
              }}
            >
              X
            </button>
            <div className="post-container">
              <div className="image-container">
                <div className="responsive-user">
                  <img
                    src={previewPost.user.avatar}
                    alt=""
                    className="comment-avatar"
                  />
                  <p
                    className="comment"
                    style={{ fontWeight: "bold", margin: "0" }}
                  >
                    {user.username}
                  </p>
                </div>
                <img src={previewPost.post.url} alt="" />
                <div className="responsive-stats">
                  <PostStats
                    currentPost={previewPost.post}
                    addComment={addComment}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    info={false}
                  />
                </div>
              </div>
              <div className="info-container">
                <div className="user-container">
                  <TitleComment title={true} />
                </div>
                <div className="comments-container">
                  <TitleComment />
                  <div ref={commentList}>
                    {comments.map((comment, index) => (
                      <Comment
                        isComment={true}
                        comment={comment}
                        key={index}
                        getComments={getComments}
                        setComments={setComments}
                        setCommentsFetched={setCommentsFetched}
                        setPage={setPage}
                      />
                    ))}
                  </div>
                  {!commentsFetched && (
                    <>
                      <button
                        className="btn-more-comments btn-secondary"
                        onClick={() => {
                          setPage((prev) => prev + 1);
                        }}
                      >
                        View more comments
                      </button>
                    </>
                  )}
                  {commentsFetched && (
                    <>
                      <p className="comments-error">No more comments</p>
                    </>
                  )}
                  {!commentsFetched && (
                    <>
                      <div className={`comments-loader ${loader}`}>
                        <div></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="stats">
                  <PostStats
                    currentPost={previewPost.post}
                    addComment={addComment}
                    commentText={commentText}
                    setCommentText={setCommentText}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
