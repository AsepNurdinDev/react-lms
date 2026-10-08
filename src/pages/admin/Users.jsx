import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/common/Badge";
import useLocalStorage from "../../hooks/useLocalStorage";
import { users as initialUsers } from "../../data/users";

function Users() {
  const [users] = useLocalStorage("lms_users", initialUsers);

  const columns = [
    { key: "name", label: "Nama" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (user) => <Badge color={user.role === "admin" ? "indigo" : "gray"}>{user.role}</Badge>,
    },
  ];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Users</h1>
      <DataTable columns={columns} data={users} emptyMessage="Belum ada user." />
    </div>
  );
}

export default Users;
