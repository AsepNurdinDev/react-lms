import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import useLocalStorage from "../../hooks/useLocalStorage";
import { users as initialUsers } from "../../data/users";

// role = "user" -> login user, role = "admin" -> login admin
function Login({ role = "user" }) {
  const isAdmin = role === "admin";
  const sessionKey = isAdmin ? "lms_current_admin" : "lms_current_user";

  const [users] = useLocalStorage("lms_users", initialUsers);
  const [currentUser, setCurrentUser] = useLocalStorage(sessionKey, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Kalau sudah login, tidak perlu melihat halaman login lagi
  if (currentUser) {
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (email.trim() === "" || password === "") {
      setError("Email dan password wajib diisi.");
      return;
    }

    // Cocokkan juga role-nya, jadi akun user tidak bisa login di halaman admin
    const foundUser = users.find(
      (user) =>
        user.email === email.trim().toLowerCase() &&
        user.password === password &&
        user.role === role
    );

    if (!foundUser) {
      setError("Email atau password salah.");
      return;
    }

    setCurrentUser({ id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role });
    navigate(isAdmin ? "/admin" : "/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">{isAdmin ? "Login Admin" : "Login"}</h1>
        <p className="mb-6 mt-1 text-sm text-gray-500">
          {isAdmin ? "Masuk ke panel admin." : "Masuk untuk mulai belajar."}
        </p>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={isAdmin ? "admin@lms.test" : "user@lms.test"}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        {!isAdmin && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link to="/register" className="font-medium text-indigo-600 hover:underline">
              Daftar
            </Link>
          </p>
        )}

        <div className="mt-6 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
          <p className="font-medium">Akun demo:</p>
          {isAdmin ? <p>Admin: admin@lms.test / admin123</p> : <p>User: user@lms.test / user123</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;