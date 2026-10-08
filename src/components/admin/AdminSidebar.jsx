import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/orders", label: "Orders" },
];

// Di layar besar (lg) sidebar selalu tampil. Di mobile sidebar bisa dibuka/tutup.
function AdminSidebar({ open, collapsed, onClose, onToggle }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose}></div>}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 p-4 text-white transition-all lg:translate-x-0 ${collapsed ? "lg:w-20" : "lg:w-64"} ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className={`text-lg font-bold ${collapsed ? "lg:hidden" : ""}`}>Admin LMS</span>
          <button className="text-xl lg:hidden" onClick={onClose} aria-label="Tutup menu">
            ✕
          </button>
          <button className="hidden rounded-lg px-2 py-1 text-sm text-gray-300 hover:bg-gray-800 lg:block" onClick={onToggle} aria-label="Toggle sidebar">{collapsed ? "→" : "←"}</button>
        </div>

        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-indigo-600" : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <span className={collapsed ? "lg:mx-auto" : ""}>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;
