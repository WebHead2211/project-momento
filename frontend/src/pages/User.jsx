import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import UserPosts from "../components/User/UserPosts";
import "../styles/User.css";
import Followers from "../components/User/Followers";

export default function User() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const { user: currentUser } = useAuthContext();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [type, setType] = useState(null);

  const getUser = async () => {
    try {
      const response = await axios.get(`/api/v1/users/getUsername/${username}`);
      setUser(response.data.data);
      if (!currentUser) {
        setIsCurrentUser(false);
        setFollows(false);
      } else {
        if (response.data.data._id === currentUser._id) {
          setIsCurrentUser(true);
        } else {
          setIsCurrentUser(false);
        }
        if (currentUser.following.includes(response.data.data._id)) {
          setFollows(true);
        } else {
          setFollows(false);
        }
      }
    } catch (error) {
      navigate("/error", { state: { error: error.response.data.error } });
    }
  };

  useEffect(() => {
    if (username) {
      setType("");
      setUser(null);
      getUser();
    }
  }, [username, currentUser]);

  const [follows, setFollows] = useState(false);

  const toggleFollow = async () => {
    if (!currentUser) {
      navigate("/accounts/login");
    } else {
      if (user) {
        try {
          await axios.post(
            `/api/v1/users/toggleFollow/${user.username}`,
            {
              withCredentials: true,
            }
          );
          setFollows((prev) => !prev);
          navigate(0);
        } catch (error) {
          navigate("/error", { state: { error: error.response.data.error } });
        }
      }
    }
  };

  useEffect(() => {
    if (type !== "") {
      document.querySelector("body").style.overflow = "hidden";
    } else {
      document.querySelector("body").style.overflow = "auto";
    }
  }, [type]);

  return (
    <div className="user-page">
      {user && (
        <>
          {type && (
            <>
              <Followers user={user} type={type} setType={setType} />
            </>
          )}
          <div className="user-info">
            <div className="user-info-image">
              <img src={user.avatar} alt="" />
            </div>
            <div className="user-info-details">
              <div className="row-one">
                <h2>{user.username}</h2>
                {isCurrentUser ? (
                  <>
                    <Link to="/editUser">
                      <button className="btn-primary btn-edit-profile">
                        Edit Profile
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-primary btn-edit-profile"
                      onClick={toggleFollow}
                    >
                      {!follows ? "Follow" : "Unfollow"}
                    </button>
                  </>
                )}
              </div>
              <div className="row-two">
                <ul>
                  <li>{user.posts.length} Posts</li>
                  <li
                    onClick={() => {
                      setType("followers");
                    }}
                  >
                    {user.followers.length} Followers
                  </li>
                  <li
                    onClick={() => {
                      setType("following");
                    }}
                  >
                    {user.following.length} Following
                  </li>
                </ul>
              </div>
              <div className="row-three">
                <h3>{user.fullName}</h3>
              </div>
            </div>
          </div>
          <div className="responsive-stats">
            <ul>
              <li>
                <span>{user.posts.length}</span> <span>Posts</span>
              </li>
              <li
                onClick={() => {
                  setType("followers");
                }}
              >
                <span>{user.followers.length}</span> <span>Followers</span>
              </li>
              <li
                onClick={() => {
                  setType("following");
                }}
              >
                <span> {user.following.length}</span> <span>Following</span>
              </li>
            </ul>
          </div>
          {user && (
            <>
              <UserPosts user={user} setUser={setUser} />
            </>
          )}
        </>
      )}
    </div>
  );
}
