import { Navigate, useLocation } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";

function ProtectedRoute({ children }) {
  const [currentUser] = useLocalStorage("lms_current_user", null);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
