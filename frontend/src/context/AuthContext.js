import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  // console.log("Auth context state updated: ", state);

  useEffect(() => {
    const findUser = async () => {
      try {
        const response = await axios.get("/api/v1/users/currentUser", {
          withCredentials: true,
        });
        console.log("Current User: ", response.data.user);
        dispatch({ type: "LOGIN", payload: response.data.user });
      } catch (error) {
        dispatch({ type: "LOGOUT" });
        console.log(error.response.data);
      }
    };
    findUser();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
