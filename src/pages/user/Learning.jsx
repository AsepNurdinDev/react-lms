import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import useLocalStorage from "../../hooks/useLocalStorage";
import getMyCourseIds from "../../utils/getMyCourseIds";
import { courses as initialCourses } from "../../data/courses";
import { orders as initialOrders } from "../../data/orders";

function Learning() {
  const { id } = useParams();
  const [currentUser] = useLocalStorage("lms_current_user", null);
  const [courses] = useLocalStorage("lms_courses", initialCourses);
  const [orders] = useLocalStorage("lms_orders", initialOrders);
  // progress disimpan seperti { "2_1": [1, 2] } -> user 2, course 1, lesson 1 dan 2 selesai
  const [progress, setProgress] = useLocalStorage("lms_progress", {});
  const [lessonIndex, setLessonIndex] = useState(0);

  const course = courses.find((item) => item.id === Number(id));

  useEffect(() => {
    if (course) document.title = `Belajar: ${course.title}`;
    return () => {
      document.title = "LMS Belajar";
    };
  }, [course]);

  if (!course) {
    return (
      <EmptyState title="Course tidak ditemukan" message="Course yang kamu cari tidak ada.">
        <Button to="/my-courses">Kembali ke My Courses</Button>
      </EmptyState>
    );
  }

  // User hanya boleh belajar kalau sudah membeli
  if (!getMyCourseIds(orders, currentUser.id).includes(course.id)) {
    return (
      <EmptyState title="Kamu belum memiliki course ini" message="Beli course ini terlebih dahulu untuk mulai belajar.">
        <Button to={`/courses/${course.id}`}>Lihat Detail Course</Button>
      </EmptyState>
    );
  }

  if (course.lessons.length === 0) {
    return <EmptyState title="Belum ada materi" message="Course ini belum memiliki lesson." />;
  }

  const progressKey = `${currentUser.id}_${course.id}`;
  const doneLessons = progress[progressKey] || [];
  const lesson = course.lessons[lessonIndex];
  const isDone = doneLessons.includes(lesson.id);
  const percent = Math.round((doneLessons.length / course.lessons.length) * 100);

  function toggleDone() {
    const newDone = isDone ? doneLessons.filter((lessonId) => lessonId !== lesson.id) : [...doneLessons, lesson.id];
    setProgress({ ...progress, [progressKey]: newDone });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>

      {/* Progress */}
      <div className="my-4">
        <div className="mb-1 flex justify-between text-sm text-gray-600">
          <span>Progress belajar</span>
          <span>
            {doneLessons.length}/{course.lessons.length} lesson ({percent}%)
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full bg-indigo-600" style={{ width: `${percent}%` }}></div>
        </div>
        {percent === 100 && <p className="mt-2 text-sm text-green-700">Selamat, kamu sudah menyelesaikan course ini! 🎉</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        {/* Sidebar lesson (di mobile tampil di bawah materi) */}
        <aside className="order-2 h-fit rounded-xl border border-gray-200 bg-white lg:order-1">
          <h2 className="border-b border-gray-200 px-4 py-3 font-semibold">Daftar Lesson</h2>
          <ul>
            {course.lessons.map((item, index) => (
              <li key={item.id}>
                <button
                  onClick={() => setLessonIndex(index)}
                  className={`flex w-full items-start gap-2 px-4 py-3 text-left text-sm ${
                    index === lessonIndex ? "bg-indigo-50 font-medium text-indigo-700" : "hover:bg-gray-50"
                  }`}
                >
                  <span>{doneLessons.includes(item.id) ? "✅" : "⚪"}</span>
                  <span>
                    {index + 1}. {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Materi */}
        <section className="order-1 rounded-xl border border-gray-200 bg-white p-5 lg:order-2">
          <p className="text-sm text-gray-500">
            Lesson {lessonIndex + 1} dari {course.lessons.length}
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">{lesson.title}</h2>
          {lesson.type === "image" && lesson.file?.data ? (
            <img src={lesson.file.data} alt={lesson.title} className="mt-4 max-h-[520px] w-full rounded-xl object-contain" />
          ) : lesson.type === "pdf" && lesson.file?.data ? (
            <div className="mt-4">
              <iframe src={lesson.file.data} title={lesson.title} className="h-[520px] w-full rounded-xl border" />
              <a href={lesson.file.data} download={lesson.file.name} className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline">Download materi PDF</a>
            </div>
          ) : (
            <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-700">{lesson.content}</p>
          )}

          <div className="mt-6">
            <Button variant={isDone ? "secondary" : "primary"} onClick={toggleDone}>
              {isDone ? "Batalkan Selesai" : "Tandai Selesai"}
            </Button>
          </div>

          <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
            <Button variant="secondary" disabled={lessonIndex === 0} onClick={() => setLessonIndex(lessonIndex - 1)}>
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={lessonIndex === course.lessons.length - 1}
              onClick={() => setLessonIndex(lessonIndex + 1)}
            >
              Next
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Learning;
