import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/common/Badge";
import useLocalStorage from "../../hooks/useLocalStorage";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import { orders as initialOrders } from "../../data/orders";

function Orders() {
  const [orders] = useLocalStorage("lms_orders", initialOrders);

  // Order terbaru di atas
  const sortedOrders = [...orders].sort((a, b) => b.id - a.id);

  const columns = [
    { key: "id", label: "Order", render: (order) => `ORD-${order.id}` },
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
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Orders</h1>
      <DataTable columns={columns} data={sortedOrders} emptyMessage="Belum ada order." />
    </div>
  );
}

export default Orders;
