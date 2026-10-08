import { Link } from "react-router-dom";
import CourseGrid from "../../components/user/CourseGrid";
import StatCard from "../../components/admin/StatCard";
import useLocalStorage from "../../hooks/useLocalStorage";
import getMyCourseIds from "../../utils/getMyCourseIds";
import { courses as initialCourses } from "../../data/courses";
import { orders as initialOrders } from "../../data/orders";

function Dashboard() {
  const [currentUser] = useLocalStorage("lms_current_user", null);
  const [courses] = useLocalStorage("lms_courses", initialCourses);
  const [orders] = useLocalStorage("lms_orders", initialOrders);

  const myCourseIds = getMyCourseIds(orders, currentUser.id);
  const myCourses = courses.filter((course) => myCourseIds.includes(course.id));

  // 3 course dengan siswa terbanyak
  const popularCourses = [...courses].sort((a, b) => b.students - a.students).slice(0, 3);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Halo, {currentUser.name} 👋</h1>
      <p className="mt-1 text-gray-500">Selamat datang kembali. Yuk lanjut belajar!</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard title="Course yang kamu miliki" value={myCourses.length} />
        <StatCard title="Course tersedia" value={courses.length} />
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Course Saya</h2>
          <Link to="/my-courses" className="text-sm font-medium text-indigo-600 hover:underline">
            Lihat semua
          </Link>
        </div>
        {myCourses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
            Kamu belum punya course. <Link to="/courses" className="font-medium text-indigo-600">Cari course</Link>
          </p>
        ) : (
          <CourseGrid courses={myCourses.slice(0, 3)} ownedIds={myCourseIds} />
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Course Populer</h2>
        <CourseGrid courses={popularCourses} ownedIds={myCourseIds} />
      </section>
    </div>
  );
}

export default Dashboard;
