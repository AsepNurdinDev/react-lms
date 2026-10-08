import { useLocation } from "react-router-dom";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import CourseGrid from "../../components/user/CourseGrid";
import useLocalStorage from "../../hooks/useLocalStorage";
import getMyCourseIds from "../../utils/getMyCourseIds";
import { courses as initialCourses } from "../../data/courses";
import { orders as initialOrders } from "../../data/orders";

function MyCourses() {
  const [currentUser] = useLocalStorage("lms_current_user", null);
  const [courses] = useLocalStorage("lms_courses", initialCourses);
  const [orders] = useLocalStorage("lms_orders", initialOrders);
  const location = useLocation();

  const myCourseIds = getMyCourseIds(orders, currentUser.id);
  const myCourses = courses.filter((course) => myCourseIds.includes(course.id));

  // Pesan sukses dikirim dari halaman Checkout lewat navigate(..., { state })
  const successMessage = location.state?.message;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">My Courses</h1>

      {successMessage && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</p>
      )}

      {myCourses.length === 0 ? (
        <EmptyState title="Belum ada course" message="Kamu belum membeli course apa pun.">
          <Button to="/courses">Lihat Daftar Course</Button>
        </EmptyState>
      ) : (
        <CourseGrid courses={myCourses} ownedIds={myCourseIds} />
      )}
    </div>
  );
}

export default MyCourses;
