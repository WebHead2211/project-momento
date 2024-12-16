import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useHomeContext } from "../../hooks/useHomeContext";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const { dispatch: homeDispatch } = useHomeContext();
  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/v1/users/logout", {
        withCredentials: true,
      });
      dispatch({ type: "LOGOUT" });
      homeDispatch({ type: "REFRESH" });
      window.scrollTo(0, 0);
    } catch (error) {
      navigate("/error", { state: { error: error.response.data.error } });
    }
  };

  return (
    <div onClick={handleLogout} className="btn-logout">
      <div>
        <i className="fa-solid fa-right-from-bracket"></i>
      </div>
      <div>
        <h2>Logout</h2>
      </div>
    </div>
  );
}
