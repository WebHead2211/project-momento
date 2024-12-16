import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Create() {
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    caption: "",
  });
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setPostImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send file and text data
    const data = new FormData();
    data.append("caption", formData.caption);
    data.append("postImage", postImage);

    try {
      const response = await axios.post("/api/v1/posts/post", data, {
        withCredentials: true,
      });
      setSuccess(true);
      setMessage(response.data.message);
    } catch (error) {
      setSuccess(false);
      setMessage(error.response.data.error);
    }

    // await signup(data);
    if (!success) {
      setFormData({
        caption: "",
      });
    }
  };

  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/accounts/login" />;
  }

  return (
    <div id="register-page-container" style={{ margin: "auto" }}>
      <div className="register-container-body">
        <h1 className="title">Create New Post</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="file-upload" className="custom-file-upload">
              Upload Image
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
          {imagePreview && (
            <>
              <div>
                <img src={imagePreview} alt="Preview" />
              </div>
            </>
          )}
          <div>
            <input
              type="text"
              name="caption"
              placeholder="Caption"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-secondary">
            Create Post
          </button>
        </form>
        {message && (
          <p
            className="error-message"
            style={{
              color: success ? "rgb(114, 255, 79)" : "rgb(255, 79, 79)",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
