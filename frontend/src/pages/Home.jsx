import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useHomeContext } from "../hooks/useHomeContext";
import { useAuthContext } from "../hooks/useAuthContext";
import HomePost from "../components/Post/HomePost";
import PostPreview from "../components/Post/PostPreview";
import FollowSuggestions from "./FollowSuggestions";
import "../styles/Home.css";

export default function Home() {
  const { posts, end } = useHomeContext();
  let [loader, setLoader] = useState("active");
  const [previewPost, setPreviewPost] = useState(null);

  useEffect(() => {
    if (end) {
      setLoader("");
    } else {
      setLoader("active");
    }
  }, [end]);

  useEffect(() => {
    if (previewPost) {
      document.querySelector("body").style.overflow = "hidden";
    } else {
      document.querySelector("body").style.overflow = "auto";
    }
  }, [previewPost]);

  useEffect(() => {
    setPreviewPost(null);
  }, []);

  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/accounts/login" />;
  }

  return (
    <>
      {previewPost && (
        <PostPreview
          setPreviewPost={setPreviewPost}
          previewPost={previewPost}
        />
      )}

      {user && user.following.length == 0 && (
        <>
          <FollowSuggestions />
        </>
      )}

      {user && user.following.length != 0 && (
        <>
          <div className="homefeed-container">
            {posts.map((post, index) => (
              <HomePost
                post={post}
                key={index}
                setPreviewPost={setPreviewPost}
                previewPost={previewPost}
              />
            ))}
            <div className={`posts-loader ${loader}`}>
              <div></div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
