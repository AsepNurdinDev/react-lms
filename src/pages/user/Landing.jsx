import { Link } from "react-router-dom";
import { courses as initialCourses } from "../../data/courses";
import useLocalStorage from "../../hooks/useLocalStorage";

function Landing() {
  const [courses] = useLocalStorage("lms_courses", initialCourses);
  const featured = courses.slice(0, 3);

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl bg-indigo-600 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-100">LMS Belajar</p>
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">Belajar skill baru dengan cara yang sederhana.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
            Temukan course, beli course yang kamu inginkan, lalu lanjutkan belajar dari satu tempat.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/courses" className="rounded-lg bg-white px-5 py-3 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
              Lihat Course
            </Link>
            <Link to="/register" className="rounded-lg border border-indigo-300 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-500">
              Buat Akun
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Course pilihan</h2>
            <p className="mt-1 text-sm text-gray-500">Beberapa course yang tersedia untuk dipelajari.</p>
          </div>
          <Link to="/courses" className="text-sm font-semibold text-indigo-600 hover:underline">Lihat semua</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`} className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
              <img src={course.image} alt={course.title} className="aspect-video w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-semibold text-indigo-600">{course.category}</p>
                <h3 className="mt-1 font-semibold text-gray-900">{course.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">{course.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["01", "Pilih Course", "Cari materi sesuai kebutuhanmu."],
          ["02", "Beli Course", "Akses course setelah pembelian berhasil."],
          ["03", "Mulai Belajar", "Buka materi dan lanjutkan progress belajar."],
        ].map(([number, title, text]) => (
          <div key={number} className="rounded-2xl border border-gray-200 bg-white p-5">
            <span className="text-sm font-bold text-indigo-600">{number}</span>
            <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Landing;
