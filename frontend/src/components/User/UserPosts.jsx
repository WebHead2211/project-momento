import { useEffect, useState } from "react";
import axios from "axios";
import UserPost from "./UserPost";
import PostPreview from "../Post/PostPreview";
import Loader from "../Other/Loader";
import "../../styles/UserPosts.css";

export default function UserPosts({ user }) {
  const [active, setActive] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState([]);
  const [postLoader, setPostLoader] = useState("active");
  const [likeLoader, setLikeLoader] = useState("active");
  const [previewPost, setPreviewPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(user);
  useEffect(() => {
    const postList = currentUser.posts;
    postList.forEach(async (post) => {
      const response = await axios.get(`/api/v1/posts/getPost/${post}`);
      setPosts((prev) => {
        return [...prev, response.data.data];
      });
    });
    setPostLoader("");

    const likedList = currentUser.likedPosts;
    likedList.forEach(async (post) => {
      const response = await axios.get(`/api/v1/posts/getPost/${post}`);
      setLiked((prev) => {
        return [...prev, response.data.data];
      });
    });
    setLikeLoader("");
  }, [currentUser]);

  useEffect(() => {
    if (previewPost) {
      document.querySelector("body").style.overflow = "hidden";
    } else {
      document.querySelector("body").style.overflow = "auto";
    }
  }, [previewPost]);

  return (
    <>
      {previewPost && (
        <PostPreview
          setPreviewPost={setPreviewPost}
          previewPost={previewPost}
          setCurrentUser={setCurrentUser}
          setPosts={setPosts}
          setLiked={setLiked}
        />
      )}
      <div className="user-posts">
        <ul className="tab-buttons">
          <li
            className={active == "posts" ? "active" : undefined}
            onClick={() => {
              setActive("posts");
            }}
          >
            <i className="fa-solid fa-table-list"></i>
            <h3>Posts</h3>
          </li>
          <li
            className={active == "liked" ? "active" : undefined}
            onClick={() => {
              setActive("liked");
            }}
          >
            <i className="fa-solid fa-heart"></i>
            <h3>Liked</h3>
          </li>
        </ul>
        <div className="user-posts-container">
          {active == "posts" && (
            <>
              {user.posts.length == 0 ? (
                <p className="empty">This user doesn't have any posts!</p>
              ) : (
                <>
                  <Loader active={postLoader} />
                  {posts
                    .sort(function (a, b) {
                      return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    .map((post, index) => (
                      <UserPost
                        post={post}
                        user={user}
                        setPreviewPost={setPreviewPost}
                        key={index}
                      />
                    ))}
                </>
              )}
            </>
          )}
          {active == "liked" && (
            <>
              {user.likedPosts.length == 0 ? (
                <p className="empty">This user hasn't liked any posts!</p>
              ) : (
                <>
                  <Loader active={likeLoader} />
                  {liked
                    .sort(function (a, b) {
                      return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    .map((post, index) => (
                      <UserPost
                        post={post}
                        user={user}
                        setPreviewPost={setPreviewPost}
                        key={index}
                      />
                    ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
