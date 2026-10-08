import Button from "../common/Button";

function AdminHeader({ user, onMenuClick, onSidebarToggle, collapsed, onLogout }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm lg:hidden"
          onClick={onMenuClick}
          aria-label="Buka menu"
        >
          ☰
        </button>
        <span className="font-medium text-gray-800">Halo, {user.name}</span>
      </div>
      <Button variant="secondary" onClick={onLogout}>
        Logout
      </Button>
    </header>
  );
}

export default AdminHeader;
