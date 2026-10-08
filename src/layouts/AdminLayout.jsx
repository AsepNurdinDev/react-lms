import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import useLocalStorage from "../hooks/useLocalStorage";

function AdminLayout() {
  const [currentUser, setCurrentUser] = useLocalStorage("lms_current_admin", null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  function handleLogout() { setCurrentUser(null); navigate("/admin/login"); }
  if (!currentUser) return <Navigate to="/admin/login" replace />;
  if (currentUser.role !== "admin") return <Navigate to="/" replace />;
  return <div className="min-h-screen bg-gray-50 text-gray-800">
    <AdminSidebar open={sidebarOpen} collapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
    <div className={sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}>
      <AdminHeader user={currentUser} onMenuClick={() => setSidebarOpen(true)} onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)} collapsed={sidebarCollapsed} onLogout={handleLogout} />
      <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
    </div>
  </div>;
}
export default AdminLayout;
