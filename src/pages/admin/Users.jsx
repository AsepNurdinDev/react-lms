import { useState } from "react";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import useLocalStorage from "../../hooks/useLocalStorage";
import { users as initialUsers } from "../../data/users";

const emptyForm = { name: "", email: "", password: "", role: "user" };

function Users() {
  const [users, setUsers] = useLocalStorage("lms_users", initialUsers);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [search, setSearch] = useState("");
  const currentAdmin = JSON.parse(localStorage.getItem("lms_current_admin") || "null");

  const filtered = users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase()));

  function openAdd() { setEditingId(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(user) { setEditingId(user.id); setForm({ name: user.name, email: user.email, password: "", role: user.role }); setModalOpen(true); }
  function save(event) {
    event.preventDefault();
    const name = form.name.trim(); const email = form.email.trim().toLowerCase();
    if (!name || !email || (editingId === null && !form.password)) return;
    if (users.some((user) => user.email === email && user.id !== editingId)) return;
    if (editingId === null) {
      const id = Math.max(0, ...users.map((user) => user.id)) + 1;
      setUsers([...users, { id, name, email, password: form.password, role: form.role }]);
    } else {
      setUsers(users.map((user) => user.id === editingId ? { ...user, name, email, role: form.role, ...(form.password ? { password: form.password } : {}) } : user));
    }
    setModalOpen(false);
  }
  function remove() {
    if (deleteUser.id === currentAdmin?.id) return;
    setUsers(users.filter((user) => user.id !== deleteUser.id));
    setDeleteUser(null);
  }

  const columns = [
    { key: "name", label: "Nama" }, { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (user) => <Badge color={user.role === "admin" ? "indigo" : "gray"}>{user.role}</Badge> },
    { key: "actions", label: "Aksi", render: (user) => <div className="flex gap-2"><Button variant="secondary" onClick={() => openEdit(user)}>Edit</Button><Button variant="danger" onClick={() => setDeleteUser(user)} disabled={user.id === currentAdmin?.id}>Hapus</Button></div> },
  ];

  return <div>
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Users</h1><p className="mt-1 text-sm text-gray-500">CRUD data pengguna dan admin.</p></div><Button onClick={openAdd}>+ Tambah User</Button></div>
    <div className="mb-4 max-w-md"><Input label="Cari user" placeholder="Nama, email, atau role" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
    <DataTable columns={columns} data={filtered} emptyMessage="Belum ada user." />

    <Modal open={modalOpen} title={editingId === null ? "Tambah User" : "Edit User"} onClose={() => setModalOpen(false)}>
      <form onSubmit={save}>
        <Input label="Nama" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Input label={editingId === null ? "Password" : "Password Baru (opsional)"} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <Input as="select" label="Role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="user">user</option><option value="admin">admin</option></Input>
        <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Batal</Button><Button type="submit">Simpan</Button></div>
      </form>
    </Modal>
    <Modal open={deleteUser !== null} title="Hapus User" onClose={() => setDeleteUser(null)}><p className="text-sm text-gray-600">Yakin ingin menghapus <strong>{deleteUser?.name}</strong>?</p><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setDeleteUser(null)}>Batal</Button><Button variant="danger" onClick={remove}>Hapus</Button></div></Modal>
  </div>;
}

export default Users;
