import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Comment.css";

export default function Comment({
  comment,
  getComments,
  setComments,
  setCommentsFetched,
  setPage,
}) {
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const { user } = useAuthContext();
  const [commenter, setCommenter] = useState(null);
  const [btnDelete, setBtnDelete] = useState(null);

  //Get the commenter for this comment
  useEffect(() => {
    const getCommenter = async () => {
      const response = await axios.get(
        `/api/v1/users/getUser/${comment.commenter}`
      );
      setCommenter(response.data.data);
    };
    let newDate = new Date(comment.createdAt);
    setDate(newDate.toLocaleDateString("en-GB"));
    getCommenter();
  }, []);

  useEffect(() => {
    if (user && comment) {
      if (user._id == comment.commenter) {
        setBtnDelete(true);
      }
    }
  }, [user]);

  const deleteComment = async () => {
    try {
      const response = await axios.delete(
        `/api/v1/posts/deleteComment/${comment._id}`,
        {
          withCredentials: true,
        }
      );
      setComments([]);
      setCommentsFetched(false);
      setPage(0);
      getComments();
    } catch (error) {
      navigate("/error", { state: { error: error.response.data.error } });
    }
  };

  return (
    <div className="comment-container">
      {!commenter ? (
        <>
          <div className="comment-loader">
            <div></div>
          </div>
        </>
      ) : (
        <>
          <Link to={`/user/${commenter.username}`}>
            <img
              src={commenter && commenter.avatar}
              alt=""
              className="comment-avatar"
            />
          </Link>
          <div className="comment-body">
            <p className="comment">
              <Link to={`/user/${commenter.username}`}>
                <span>{commenter && commenter.username}</span>
              </Link>
              {comment.comment}
            </p>
            <p className="comment-date">{date}</p>
          </div>
          {btnDelete && (
            <>
              <button className="comment-delete-btn" onClick={deleteComment}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
