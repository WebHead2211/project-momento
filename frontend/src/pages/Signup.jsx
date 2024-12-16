import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import "../styles/register.css";
import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Signup = () => {
  const { signup, message, loading } = useRegister();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send file and text data
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("fullName", formData.fullName);
    data.append("avatar", avatar);

    await signup(data);
    if (message) {
      setFormData({
        username: "",
        email: "",
        fullName: "",
        password: "",
      });
    }
  };

  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div id="register-page-container">
      <div className="register-container-body">
        <Link to="/">
          <h1 className="title">Momento</h1>
        </Link>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            {/* <label style={{ textAlign: "left" }}>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              style={{ padding: "0" }}
            /> */}
            <label htmlFor="file-upload" className="custom-file-upload">
              Upload Avatar
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              style={{ padding: "0" }}
            />
          </div>
          <button type="submit" className="btn-secondary" disabled={loading}>
            Sign up
          </button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
      <div className="register-container-body">
     
          Have an account?{" "}
        
          <Link to={"/accounts/login"}>
            <p className="btn-primary">Login</p>
          </Link>
      </div>
    </div>
  );
};

export default Signup;
