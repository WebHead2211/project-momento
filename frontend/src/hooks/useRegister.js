import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext.js";
import { useHomeContext } from "./useHomeContext.js";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const signup = async (data) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await axios.post("/api/v1/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      // setMessage(response.data.message);
      console.log(response.data);
      dispatch({ type: "LOGIN", payload: response.data.data });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.error);
      setLoading(false);
    }
  };

  const login = async (loginData, password) => {
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/v1/users/login",
        {
          loginData,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      dispatch({ type: "LOGIN", payload: response.data.data });
      setLoading(false);
      navigate(-1);
    } catch (error) {
      console.log(error.response.data.error);
      setMessage(error.response.data.error || error.message);
      setLoading(false);
    }
  };

  const edit = async (data) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await axios.patch("/api/v1/users/editUser", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(response.data);
      dispatch({ type: "LOGIN", payload: response.data.data });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.error);
      setMessage(error.response.data.error);
      setLoading(false);
    }
  };

  return { signup, login, edit, loading, message };
};
