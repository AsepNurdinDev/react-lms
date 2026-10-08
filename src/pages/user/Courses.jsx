import { useState } from "react";
import CourseGrid from "../../components/user/CourseGrid";
import Input from "../../components/common/Input";
import useLocalStorage from "../../hooks/useLocalStorage";
import getMyCourseIds from "../../utils/getMyCourseIds";
import { courses as initialCourses, categories } from "../../data/courses";
import { orders as initialOrders } from "../../data/orders";

function Courses() {
  const [currentUser] = useLocalStorage("lms_current_user", null);
  const [courses] = useLocalStorage("lms_courses", initialCourses);
  const [orders] = useLocalStorage("lms_orders", initialOrders);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const myCourseIds = currentUser ? getMyCourseIds(orders, currentUser.id) : [];

  const filteredCourses = courses.filter((course) => {
    const matchSearch = `${course.title} ${course.description}`.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Semua" || course.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Daftar Course</h1>
      <p className="mb-4 mt-1 text-gray-500">Katalog dapat dilihat tanpa login. Login diperlukan untuk membeli dan belajar.</p>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Input label="Cari course" placeholder="Contoh: React" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Input as="select" label="Kategori" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="Semua">Semua</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </Input>
      </div>
      <CourseGrid courses={filteredCourses} ownedIds={myCourseIds} />
    </div>
  );
}

export default Courses;
