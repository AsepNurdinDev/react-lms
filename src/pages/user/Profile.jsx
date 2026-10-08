import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import useLocalStorage from "../../hooks/useLocalStorage";
import { users as initialUsers } from "../../data/users";

function Profile() {
  const [currentUser, setCurrentUser] = useLocalStorage("lms_current_user", null);
  const [users, setUsers] = useLocalStorage("lms_users", initialUsers);
  const [form, setForm] = useState({ name: currentUser.name, email: currentUser.email, password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function save(event) {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (!name || !email) return;
    if (users.some((user) => user.email === email && user.id !== currentUser.id)) {
      setMessage("Email sudah digunakan user lain.");
      return;
    }
    const updatedUsers = users.map((user) => user.id === currentUser.id ? {
      ...user, name, email, ...(form.password ? { password: form.password } : {}),
    } : user);
    setUsers(updatedUsers);
    setCurrentUser({ ...currentUser, name, email, role: currentUser.role });
    setForm({ name, email, password: "" });
    setMessage("Profil berhasil diperbarui.");
  }

  return <div className="mx-auto max-w-2xl">
    <div className="mb-5"><h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1><p className="mt-1 text-sm text-gray-500">Kelola data akun kamu.</p></div>
    {message && <div className="mb-4 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">{message}</div>}
    <form onSubmit={save} className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <Input label="Nama" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
      <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      <Input label="Password Baru" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Kosongkan jika tidak diubah" />
      <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => navigate("/")}>Batal</Button><Button type="submit">Simpan Perubahan</Button></div>
    </form>
  </div>;
}
export default Profile;
