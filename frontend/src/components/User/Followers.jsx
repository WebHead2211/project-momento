import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Followers.css";

export default function Followers({ user, type, setType }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    const getList = async () => {
      if (type == "followers") {
        const response = await axios.get(`/api/v1/users/getUser/${user._id}`);
        response.data.data.followers.forEach(async (item) => {
          const follower = await axios.get(`/api/v1/users/getUser/${item}`);
          setList((prev) => {
            return [...prev, follower.data.data];
          });
        });
      } else {
        const response = await axios.get(`/api/v1/users/getUser/${user._id}`);
        response.data.data.following.forEach(async (item) => {
          const follower = await axios.get(`/api/v1/users/getUser/${item}`);
          setList((prev) => {
            return [...prev, follower.data.data];
          });
        });
      }
    };
    if (user) {
      getList();
    }
  }, [user]);
  return (
    <div className="followers-bg">
      <div className="followers-list">
        <button
          className="btn-close btn-secondary"
          onClick={() => {
            setType("");
          }}
        >
          <p>X</p>
        </button>
        <h1>{type == "followers" ? "Followers" : "Following"}</h1>
        <ul>
          {type == "followers" ? (
            <>
              {list.length == 0 && (
                <>
                  <p>This user has no followers</p>
                </>
              )}
            </>
          ) : (
            <>
              {list.length == 0 && (
                <>
                  <p>This user follows no one</p>
                </>
              )}
            </>
          )}
          {list.map((item, index) => (
            <li key={index}>
              <Link to={`/user/${item.username}`}>
                <img src={item.avatar} alt="" />
                <h3>{item.username}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
