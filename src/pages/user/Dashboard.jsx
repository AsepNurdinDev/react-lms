import { Link } from "react-router-dom";
import CourseGrid from "../../components/user/CourseGrid";
import useLocalStorage from "../../hooks/useLocalStorage";
import getMyCourseIds from "../../utils/getMyCourseIds";
import { courses as initialCourses } from "../../data/courses";
import { orders as initialOrders } from "../../data/orders";

function Dashboard() {
  const [currentUser] = useLocalStorage("lms_current_user", null);
  const [courses] = useLocalStorage("lms_courses", initialCourses);
  const [orders] = useLocalStorage("lms_orders", initialOrders);
  const [progress] = useLocalStorage("lms_progress", {});

  const myCourseIds = getMyCourseIds(orders, currentUser.id);
  const myCourses = courses.filter((course) => myCourseIds.includes(course.id));
  const totalLessons = myCourses.reduce((sum, course) => sum + course.lessons.length, 0);
  const completedLessons = myCourses.reduce((sum, course) => sum + (progress[`${currentUser.id}_${course.id}`]?.length || 0), 0);
  const completion = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const continueCourse = myCourses.find((course) => {
    const done = progress[`${currentUser.id}_${course.id}`]?.length || 0;
    return done > 0 && done < course.lessons.length;
  }) || myCourses[0];
  const popularCourses = [...courses].sort((a, b) => b.students - a.students).slice(0, 3);

  return (
    <div>
      <section className="rounded-2xl bg-indigo-600 p-5 text-white sm:p-7">
        <p className="text-sm text-indigo-100">Dashboard Siswa</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Halo, {currentUser.name} 👋</h1>
        <p className="mt-2 max-w-2xl text-sm text-indigo-100">Lanjutkan pembelajaranmu dan selesaikan course yang sudah kamu miliki.</p>
        {continueCourse && (
          <Link to={`/learning/${continueCourse.id}`} className="mt-5 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
            Lanjutkan Belajar
          </Link>
        )}
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Course Saya", myCourses.length, "Course yang sudah dimiliki"],
          ["Materi Selesai", completedLessons, `Dari ${totalLessons} materi`],
          ["Progress Belajar", `${completion}%`, "Total pembelajaran"],
        ].map(([label, value, caption]) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
            <p className="mt-1 text-xs text-gray-500">{caption}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lanjut Belajar</h2>
          <Link to="/my-courses" className="text-sm font-medium text-indigo-600 hover:underline">Lihat semua</Link>
        </div>
        {myCourses.length ? <CourseGrid courses={myCourses.slice(0, 3)} ownedIds={myCourseIds} /> : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            Kamu belum memiliki course. <Link to="/courses" className="font-medium text-indigo-600">Cari course sekarang</Link>.
          </div>
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
