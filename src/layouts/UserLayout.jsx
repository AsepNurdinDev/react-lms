import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/user/Navbar";
import useLocalStorage from "../hooks/useLocalStorage";

function UserLayout() {
  const [currentUser, setCurrentUser] = useLocalStorage("lms_current_user", null);
  const navigate = useNavigate();

  function handleLogout() {
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      <Navbar user={currentUser} onLogout={handleLogout} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-5 text-center text-sm text-gray-500">
        © 2026 LMS Belajar - Tugas Frontend Programming
      </footer>
    </div>
  );
}

export default UserLayout;
