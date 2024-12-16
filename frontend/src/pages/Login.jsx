import "../styles/register.css";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import { useAuthContext } from "../hooks/useAuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    loginData: "",
    password: "",
  });
  const { login, message, loading } = useRegister();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.loginData, formData.password);
    if (message) {
      setFormData({
        loginData: "",
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
              name="loginData"
              placeholder="Username or email"
              value={formData.loginData}
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

          <button type="submit" className="btn-primary" disabled={loading}>
            Login
          </button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
      <div className="register-container-body">
        Don't have an account?
        <Link to={"/accounts/signup"}>
          <p className="btn-secondary">Sign up</p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
