import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import useLocalStorage from "../../hooks/useLocalStorage";
import { users as initialUsers } from "../../data/users";

function Register() {
  const [users, setUsers] = useLocalStorage("lms_users", initialUsers);
  const [currentUser, setCurrentUser] = useLocalStorage("lms_current_user", null);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to={currentUser.role === "admin" ? "/admin" : "/"} replace />;
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();

    if (form.name.trim() === "" || email === "" || form.password === "") {
      setError("Semua field wajib diisi.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }
    if (users.some((user) => user.email === email)) {
      setError("Email sudah terdaftar.");
      return;
    }

    const newUser = {
      id: Math.max(...users.map((user) => user.id)) + 1,
      name: form.name.trim(),
      email: email,
      password: form.password,
      role: "user",
    };

    setUsers([...users, newUser]);
    setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
    navigate("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">Daftar</h1>
        <p className="mb-6 mt-1 text-sm text-gray-500">Buat akun baru untuk mulai belajar.</p>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input label="Nama" name="name" value={form.name} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
          <Input
            label="Konfirmasi Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <Button type="submit" className="w-full">
            Daftar
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
