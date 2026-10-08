import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "../common/Button";

const links = [
  { to: "/", label: "Beranda", public: true },
  { to: "/courses", label: "Courses", public: true },
  { to: "/my-courses", label: "My Courses", public: false },
];

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleLinks = links.filter((link) => link.public || user);

  function linkClass({ isActive }) {
    return `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold text-indigo-600">LMS Belajar</Link>
        <nav className="hidden items-center gap-1 md:flex">
          {visibleLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>{link.label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? <><span className="max-w-32 truncate text-sm text-gray-600">{user.name}</span><Button variant="secondary" onClick={onLogout}>Logout</Button></> : <><Button variant="secondary" to="/login">Login</Button><Button to="/register">Daftar</Button></>}
        </div>
        <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka menu">{menuOpen ? "✕" : "☰"}</button>
      </div>
      {menuOpen && (
        <nav className="space-y-1 border-t border-gray-200 px-4 py-3 md:hidden">
          {visibleLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass} onClick={() => setMenuOpen(false)}>{link.label}</NavLink>)}
          {user ? <Button variant="secondary" className="mt-2 w-full" onClick={onLogout}>Logout</Button> : <div className="mt-2 grid grid-cols-2 gap-2"><Button variant="secondary" to="/login" onClick={() => setMenuOpen(false)}>Login</Button><Button to="/register" onClick={() => setMenuOpen(false)}>Daftar</Button></div>}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
