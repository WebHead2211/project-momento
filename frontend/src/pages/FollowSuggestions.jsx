import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function FollowSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getResults = async () => {
      try {
        const response = await axios.get("/api/v1/users/suggestions");
        setSuggestions(response.data.data);
      } catch (error) {
        console.log(error);
        navigate("/error", { state: { error: error.response.data.error } });
      }
    };
    getResults();
  }, []);

  return (
    <div className="follow-suggestions-container">
      <h2>Looks like you don't follow anyone!</h2>
      <h3>Some suggested accounts to follow</h3>

      {suggestions && (
        <>
          {suggestions.map((item, index) => (
            <Link to={`/user/${item.username}`} key={index}>
              <div className="search-result">
                <div>
                  <img src={item.avatar} alt="" />
                </div>
                <div className="search-name">
                  <h3>@{item.username}</h3>
                  <h4>{item.fullName}</h4>
                </div>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
