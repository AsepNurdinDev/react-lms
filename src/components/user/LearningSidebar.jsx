function LearningSidebar({ course, activeIndex, doneLessons, open, onClose, onSelect }) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Tutup daftar materi"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[88vw] flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:h-[calc(100vh-73px)] lg:w-80 lg:max-w-none lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="border-b border-gray-200 p-4">
          <button type="button" onClick={onClose} className="mb-3 text-sm text-gray-500 lg:hidden">
            ← Tutup materi
          </button>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">Course</p>
          <h2 className="mt-1 line-clamp-2 font-semibold text-gray-900">{course.title}</h2>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${Math.round((doneLessons.length / course.lessons.length) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {doneLessons.length} dari {course.lessons.length} materi selesai
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {course.lessons.map((lesson, index) => {
            const done = doneLessons.includes(lesson.id);
            const active = index === activeIndex;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => {
                  onSelect(index);
                  onClose();
                }}
                className={`mb-1 flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                  active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    done ? "bg-green-100 text-green-700" : active ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {done ? "✓" : index + 1}
                </span>
                <span className={done ? "line-through decoration-gray-300" : ""}>{lesson.title}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}

export default LearningSidebar;
