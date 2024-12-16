import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import "../styles/register.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";

const EditUser = () => {
  let navigate = useNavigate();
  const { edit, message, loading } = useRegister();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const { user } = useAuthContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username &&
      !formData.email &&
      !formData.password &&
      !formData.fullName &&
      !avatar
    ) {
      navigate(`/user/${user.username}`);
      return;
    }
    // Create a FormData object to send file and text data
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("fullName", formData.fullName);
    if (avatar) {
      data.append("avatar", avatar);
    }

    await edit(data);

    const updatedUser = await axios.get(`/api/v1/users/getUser/${user._id}`);

    if (message) {
      setFormData({
        username: "",
        email: "",
        fullName: "",
        password: "",
      });
    } else {
      navigate(`/user/${updatedUser.data.data.username}`);
    }
  };
  
    if (!user) {
      return <Navigate to="/accounts/login" />;
    }

  return (
    <>
      {user && (
        <>
          <div id="register-page-container">
            <div className="register-container-body">
              <h1 className="title">Edit Profile</h1>

              <form onSubmit={handleSubmit} id="edit-form">
                <div>
                  <label htmlFor="edit-username">Username</label>
                  <input
                    type="text"
                    name="username"
                    id="edit-username"
                    placeholder={user.username}
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="form-username">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="edit-email"
                    placeholder={user.email}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="edit-fullName">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    id="edit-fullName"
                    placeholder={user.fullName}
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="edit-password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="edit-password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="file-upload" className="custom-file-upload">
                    Upload new avatar
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ padding: "0" }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-secondary"
                  disabled={loading}
                >
                  Save Changes
                </button>
              </form>
              {message && <p className="error-message">{message}</p>}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EditUser;
