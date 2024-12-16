import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import DeleteWithConfirmation from "../Other/DeleteWithConfirmation";
import "../../styles/UserPost.css";

export default function UserPost({ post, user, setPreviewPost }) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();
  return (
    <div
      className="user-post"
      onClick={() => {
        if (!currentUser) {
          navigate("/accounts/login");
        } else setPreviewPost({ post: post, user: user });
      }}
    >
      <img src={post.url} alt={post.caption} className="" />
      {currentUser && currentUser._id === user._id && (
        <>
          <DeleteWithConfirmation id={post._id} />
        </>
      )}
      <div className="user-post-info">
        <div>
          <i className="fa-solid fa-heart"></i>
          <p>{post.likes.length}</p>
        </div>
        <div>
          <i className="fa-solid fa-comment"></i>
          <p>{post.comments.length}</p>
        </div>
      </div>
    </div>
  );
}
