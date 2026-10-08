import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

function LearningLayout({ course, onOpenSidebar, children }) {
  const [currentUser] = useLocalStorage("lms_current_user", null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="sticky top-0 z-50 flex h-[73px] items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm lg:hidden"
            aria-label="Buka daftar materi"
          >
            ☰ Materi
          </button>
          <Link to="/" className="hidden font-bold text-indigo-600 sm:block">LMS Belajar</Link>
          <div className="hidden h-6 w-px bg-gray-200 sm:block" />
          <p className="max-w-[55vw] truncate text-sm font-medium text-gray-700 sm:max-w-[42vw]">{course.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-500 sm:block">{currentUser?.name}</span>
          <Link to="/" className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50">
            Keluar
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}

export default LearningLayout;
