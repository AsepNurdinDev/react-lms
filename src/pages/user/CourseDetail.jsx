import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import useLocalStorage from "../../hooks/useLocalStorage";
import getMyCourseIds from "../../utils/getMyCourseIds";
import formatCurrency from "../../utils/formatCurrency";
import { courses as initialCourses } from "../../data/courses";
import { orders as initialOrders } from "../../data/orders";

function CourseDetail() {
  const { id } = useParams();
  const [currentUser] = useLocalStorage("lms_current_user", null);
  const [courses] = useLocalStorage("lms_courses", initialCourses);
  const [orders] = useLocalStorage("lms_orders", initialOrders);

  const course = courses.find((item) => item.id === Number(id));

  // Ubah judul tab browser sesuai course
  useEffect(() => {
    if (course) document.title = course.title;
    return () => {
      document.title = "LMS Belajar";
    };
  }, [course]);

  if (!course) {
    return (
      <EmptyState title="Course tidak ditemukan" message="Course yang kamu cari tidak ada atau sudah dihapus.">
        <Button to="/courses">Kembali ke Daftar Course</Button>
      </EmptyState>
    );
  }

  const isOwned = currentUser ? getMyCourseIds(orders, currentUser.id).includes(course.id) : false;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <img src={course.image} alt={course.title} className="aspect-video w-full rounded-xl object-cover" />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge color="indigo">{course.category}</Badge>
          <Badge>{course.level}</Badge>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{course.title}</h1>
        <p className="mt-2 text-gray-600">{course.description}</p>

        <h2 className="mb-3 mt-8 text-lg font-semibold">Daftar Lesson</h2>
        <ol className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {course.lessons.map((lesson, index) => (
            <li key={lesson.id} className="px-4 py-3 text-sm">
              {index + 1}. {lesson.title}
            </li>
          ))}
        </ol>
      </div>

      <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-2xl font-bold text-indigo-600">{formatCurrency(course.price)}</p>

        <dl className="my-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Instructor</dt>
            <dd className="font-medium">{course.instructor}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Durasi</dt>
            <dd className="font-medium">{course.duration}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Jumlah siswa</dt>
            <dd className="font-medium">{course.students}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Jumlah lesson</dt>
            <dd className="font-medium">{course.lessons.length}</dd>
          </div>
        </dl>

        {isOwned ? (
          <Button to={`/learning/${course.id}`} className="w-full">Mulai Belajar</Button>
        ) : currentUser ? (
          <Button to={`/checkout/${course.id}`} className="w-full">Beli Sekarang</Button>
        ) : (
          <Button to="/login" className="w-full">Login untuk Membeli</Button>
        )}
      </aside>
    </div>
  );
}

export default CourseDetail;
