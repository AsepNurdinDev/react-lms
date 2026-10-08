import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import LearningSidebar from "../../components/user/LearningSidebar";
import LearningLayout from "../../layouts/LearningLayout";
import useLocalStorage from "../../hooks/useLocalStorage";
import getMyCourseIds from "../../utils/getMyCourseIds";
import { courses as initialCourses } from "../../data/courses";
import { orders as initialOrders } from "../../data/orders";

function Learning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser] = useLocalStorage("lms_current_user", null);
  const [courses] = useLocalStorage("lms_courses", initialCourses);
  const [orders] = useLocalStorage("lms_orders", initialOrders);
  const [progress, setProgress] = useLocalStorage("lms_progress", {});
  const [lessonIndex, setLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const course = courses.find((item) => item.id === Number(id));

  useEffect(() => {
    if (course) document.title = `Belajar: ${course.title}`;
    return () => { document.title = "LMS Belajar"; };
  }, [course]);

  useEffect(() => {
    setLessonIndex(0);
    setSidebarOpen(false);
  }, [id]);

  const progressKey = currentUser && course ? `${currentUser.id}_${course.id}` : null;
  const doneLessons = progressKey ? progress[progressKey] || [] : [];
  const lesson = course?.lessons?.[lessonIndex];
  const percent = course?.lessons?.length ? Math.round((doneLessons.length / course.lessons.length) * 100) : 0;
  const isDone = lesson ? doneLessons.includes(lesson.id) : false;
  const hasNext = lessonIndex < (course?.lessons?.length || 0) - 1;

  const nextLessonIndex = useMemo(() => {
    if (!course) return -1;
    return lessonIndex + 1;
  }, [course, lessonIndex]);

  if (!currentUser) return <Navigate to="/login" replace />;

  if (!course) {
    return <EmptyState title="Course tidak ditemukan" message="Course yang kamu cari tidak ada atau sudah dihapus."><Button to="/my-courses">Kembali ke Course Saya</Button></EmptyState>;
  }

  if (!getMyCourseIds(orders, currentUser.id).includes(course.id)) {
    return <EmptyState title="Akses belajar belum tersedia" message="Kamu harus memiliki course ini terlebih dahulu untuk membuka materi."><Button to={`/courses/${course.id}`}>Lihat Detail Course</Button></EmptyState>;
  }

  if (!course.lessons?.length) {
    return <EmptyState title="Belum ada materi" message="Admin belum menambahkan materi ke course ini."><Button to="/my-courses">Kembali ke Course Saya</Button></EmptyState>;
  }

  function toggleDone() {
    const newDone = isDone
      ? doneLessons.filter((lessonId) => lessonId !== lesson.id)
      : [...doneLessons, lesson.id];
    setProgress({ ...progress, [progressKey]: newDone });
  }

  function goNext() {
    if (isDone && hasNext) setLessonIndex(nextLessonIndex);
    else if (!isDone) toggleDone();
  }

  return (
    <LearningLayout course={course} onOpenSidebar={() => setSidebarOpen(true)}>
      <div className="flex min-h-[calc(100vh-73px)]">
        <LearningSidebar
          course={course}
          activeIndex={lessonIndex}
          doneLessons={doneLessons}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelect={setLessonIndex}
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Materi {lessonIndex + 1} dari {course.lessons.length}</p>
                <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{lesson.title}</h1>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">Progress {percent}%</span>
            </div>

            <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${percent}%` }} />
            </div>

            <article className="min-h-[420px] rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              {lesson.type === "image" && lesson.file?.data ? (
                <img src={lesson.file.data} alt={lesson.title} className="mx-auto max-h-[620px] w-full rounded-xl object-contain" />
              ) : lesson.type === "pdf" && lesson.file?.data ? (
                <div>
                  <iframe src={lesson.file.data} title={lesson.title} className="h-[65vh] min-h-[420px] w-full rounded-xl border border-gray-200" />
                  <a href={lesson.file.data} download={lesson.file.name} className="mt-4 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Download PDF
                  </a>
                </div>
              ) : (
                <div className="whitespace-pre-line text-[15px] leading-8 text-gray-700 sm:text-base">{lesson.content}</div>
              )}
            </article>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="secondary" disabled={lessonIndex === 0} onClick={() => setLessonIndex((value) => value - 1)}>
                ← Sebelumnya
              </Button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant={isDone ? "secondary" : "primary"} onClick={toggleDone}>
                  {isDone ? "✓ Sudah Selesai" : "Tandai Selesai"}
                </Button>
                {hasNext ? (
                  <Button onClick={goNext}>{isDone ? "Materi Berikutnya →" : "Selesai & Lanjut →"}</Button>
                ) : (
                  <Button onClick={() => navigate("/")}>Selesai Belajar</Button>
                )}
              </div>
            </div>

            {percent === 100 && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                🎉 Selamat! Semua materi dalam course ini sudah kamu selesaikan.
              </div>
            )}
          </div>
        </main>
      </div>
    </LearningLayout>
  );
}

export default Learning;
