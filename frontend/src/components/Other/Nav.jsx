import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../../styles/Nav.css";
import LogoutButton from "./LogoutButton";
export default function Nav() {
  const { user } = useAuthContext();

  const NavUser = () => {
    return (
      <>
        {user && (
          <>
            <li title="Create new post">
              <NavLink to={`/new`}>
                <div>
                  <i className="fa-regular fa-square-plus"></i>
                </div>
                <div>
                  <h2>Create</h2>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to={`/user/${user.username}`}>
                <div>
                  <img src={user.avatar} alt="" id="nav-user-avatar" />
                </div>
                <div>
                  <h2>Profile</h2>
                </div>
              </NavLink>
            </li>
            <li>
              <LogoutButton />
            </li>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <ul className="navlink-list">
        <li>
          <NavLink to="/">
            <div>
              {" "}
              <img
                src="https://res.cloudinary.com/aayushcloudinary/image/upload/v1733832361/momento-icon-white_xkfqff.png"
                alt="Momento Icon"
                className="momento-icon"
              />
            </div>
            <div>
              <h1 className="title" style={{ color: "white" }}>
                Momento
              </h1>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink to="/">
            <div>
              <i className="fa-solid fa-house"></i>
            </div>
            <div>
              <h2>Home</h2>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink to="/search">
            <div>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <div>
              <h2>Search</h2>
            </div>
          </NavLink>
        </li>
        <NavUser />
      </ul>
    </>
  );
}
