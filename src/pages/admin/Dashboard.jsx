import StatCard from "../../components/admin/StatCard";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/common/Badge";
import useLocalStorage from "../../hooks/useLocalStorage";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import { courses as initialCourses } from "../../data/courses";
import { users as initialUsers } from "../../data/users";
import { orders as initialOrders } from "../../data/orders";

function Dashboard() {
  const [courses] = useLocalStorage("lms_courses", initialCourses);
  const [users] = useLocalStorage("lms_users", initialUsers);
  const [orders] = useLocalStorage("lms_orders", initialOrders);

  // Pendapatan hanya dari order yang sudah lunas
  const revenue = orders
    .filter((order) => order.status === "Lunas")
    .reduce((total, order) => total + order.price, 0);

  const latestOrders = [...orders].sort((a, b) => b.id - a.id).slice(0, 5);

  const columns = [
    { key: "userName", label: "User" },
    { key: "courseTitle", label: "Course" },
    { key: "price", label: "Harga", render: (order) => formatCurrency(order.price) },
    {
      key: "status",
      label: "Status",
      render: (order) => <Badge color={order.status === "Lunas" ? "green" : "yellow"}>{order.status}</Badge>,
    },
    { key: "date", label: "Tanggal", render: (order) => formatDate(order.date) },
  ];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Jumlah Course" value={courses.length} />
        <StatCard title="Jumlah User" value={users.length} />
        <StatCard title="Jumlah Order" value={orders.length} />
        <StatCard title="Pendapatan" value={formatCurrency(revenue)} />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Order Terbaru</h2>
      <DataTable columns={columns} data={latestOrders} emptyMessage="Belum ada order." />
    </div>
  );
}

export default Dashboard;
