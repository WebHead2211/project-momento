import axios from "axios";
import React, { useEffect, useState } from "react";

export default function HomeFollowers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get("/api/v1/users/getUpdatedFollowers", {
        withCredentials: true,
      });
      setUsers(response.data.data);
    };
    getUsers();
  }, []);

  return (
    <div className="followers-container">
      {users.map((user, index) => (
        <div className="followers-bg" key={index}>
          <img src={user.avatar} alt="" className="user-avatar" />
        </div>
      ))}
    </div>
  );
}
