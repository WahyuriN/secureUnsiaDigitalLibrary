import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <div>
        <strong>Secure UNSIA Digital Library</strong>
      </div>

      <div>
        <span>{user?.name}</span>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;