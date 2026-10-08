import CourseCard from "./CourseCard";
import EmptyState from "../common/EmptyState";

function CourseGrid({ courses, ownedIds = [] }) {
  if (courses.length === 0) {
    return <EmptyState title="Tidak ada course" message="Course yang kamu cari tidak ditemukan." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} owned={ownedIds.includes(course.id)} />
      ))}
    </div>
  );
}

export default CourseGrid;
