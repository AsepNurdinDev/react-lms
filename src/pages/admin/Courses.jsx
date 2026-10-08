import { useState } from "react";
import DataTable from "../../components/admin/DataTable";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import FileUpload from "../../components/common/FileUpload";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import useLocalStorage from "../../hooks/useLocalStorage";
import formatCurrency from "../../utils/formatCurrency";
import { courses as initialCourses, categories } from "../../data/courses";

const levels = ["Beginner", "Intermediate", "Advanced"];
const emptyForm = { title: "", instructor: "", category: categories[0], level: levels[0], price: "", duration: "", description: "", image: null };
const emptyLesson = { title: "", type: "text", content: "", file: null };

function Courses() {
  const [courses, setCourses] = useLocalStorage("lms_courses", initialCourses);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [materialCourse, setMaterialCourse] = useState(null);
  const [lesson, setLesson] = useState(emptyLesson);

  const filteredCourses = courses.filter((course) => `${course.title} ${course.instructor} ${course.category}`.toLowerCase().includes(search.toLowerCase()));

  function openAddForm() { setEditingId(null); setForm(emptyForm); setErrors({}); setShowForm(true); }
  function openEditForm(course) {
    setEditingId(course.id);
    setForm({ title: course.title, instructor: course.instructor, category: course.category, level: course.level, price: String(course.price), duration: course.duration, description: course.description, image: course.imageData || null });
    setErrors({}); setShowForm(true);
  }
  function handleChange(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Judul wajib diisi.";
    if (!form.instructor.trim()) next.instructor = "Instructor wajib diisi.";
    if (!form.price || Number(form.price) <= 0) next.price = "Harga harus lebih dari 0.";
    if (!form.duration.trim()) next.duration = "Durasi wajib diisi.";
    if (!form.description.trim()) next.description = "Deskripsi wajib diisi.";
    return next;
  }
  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(); setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    const old = editingId === null ? null : courses.find((course) => course.id === editingId);
    const courseData = { title: form.title.trim(), instructor: form.instructor.trim(), category: form.category, level: form.level, price: Number(form.price), duration: form.duration.trim(), description: form.description.trim(), image: form.image?.data || old?.image || "/course-placeholder.svg", imageData: form.image?.data || old?.imageData || null };
    if (editingId === null) {
      setCourses([...courses, { id: Math.max(0, ...courses.map((course) => course.id)) + 1, ...courseData, students: 0, lessons: [] }]);
    } else {
      setCourses(courses.map((course) => course.id === editingId ? { ...course, ...courseData } : course));
    }
    setShowForm(false);
  }
  function handleDelete() { setCourses(courses.filter((course) => course.id !== courseToDelete.id)); setCourseToDelete(null); }

  function addLesson(event) {
    event.preventDefault();
    if (!lesson.title.trim()) return;
    if (lesson.type === "text" && !lesson.content.trim()) return;
    if ((lesson.type === "image" || lesson.type === "pdf") && !lesson.file) return;
    const nextLesson = { id: Math.max(0, ...(materialCourse.lessons || []).map((item) => item.id)) + 1, title: lesson.title.trim(), type: lesson.type, content: lesson.type === "text" ? lesson.content.trim() : "", file: lesson.file };
    setCourses(courses.map((course) => course.id === materialCourse.id ? { ...course, lessons: [...(course.lessons || []), nextLesson] } : course));
    setMaterialCourse({ ...materialCourse, lessons: [...(materialCourse.lessons || []), nextLesson] });
    setLesson(emptyLesson);
  }
  function removeLesson(lessonId) {
    const nextLessons = (materialCourse.lessons || []).filter((item) => item.id !== lessonId);
    setCourses(courses.map((course) => course.id === materialCourse.id ? { ...course, lessons: nextLessons } : course));
    setMaterialCourse({ ...materialCourse, lessons: nextLessons });
  }

  const columns = [
    { key: "title", label: "Judul" },
    { key: "category", label: "Kategori", render: (course) => <Badge color="indigo">{course.category}</Badge> },
    { key: "level", label: "Level" },
    { key: "price", label: "Harga", render: (course) => formatCurrency(course.price) },
    { key: "lessons", label: "Materi", render: (course) => course.lessons?.length || 0 },
    { key: "actions", label: "Aksi", render: (course) => <div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => openEditForm(course)}>Edit</Button><Button variant="secondary" onClick={() => { setMaterialCourse(course); setLesson(emptyLesson); }}>Materi</Button><Button variant="danger" onClick={() => setCourseToDelete(course)}>Hapus</Button></div> },
  ];

  return <div>
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Courses</h1><p className="mt-1 text-sm text-gray-500">Kelola course, gambar, dan materi pembelajaran.</p></div><Button onClick={openAddForm}>+ Tambah Course</Button></div>
    <div className="mb-4 max-w-sm"><Input label="Cari course" placeholder="Judul, instructor, atau kategori" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
    <DataTable columns={columns} data={filteredCourses} emptyMessage="Tidak ada course yang ditemukan." />

    <Modal open={showForm} title={editingId === null ? "Tambah Course" : "Edit Course"} onClose={() => setShowForm(false)}>
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Judul" name="title" value={form.title} onChange={handleChange} error={errors.title} />
        <Input label="Instructor" name="instructor" value={form.instructor} onChange={handleChange} error={errors.instructor} />
        <div className="grid gap-x-4 sm:grid-cols-2"><Input as="select" label="Kategori" name="category" value={form.category} onChange={handleChange}>{categories.map((item) => <option key={item}>{item}</option>)}</Input><Input as="select" label="Level" name="level" value={form.level} onChange={handleChange}>{levels.map((item) => <option key={item}>{item}</option>)}</Input><Input label="Harga (Rp)" name="price" type="number" min="0" value={form.price} onChange={handleChange} error={errors.price} /><Input label="Durasi" name="duration" placeholder="Contoh: 8 Jam" value={form.duration} onChange={handleChange} error={errors.duration} /></div>
        <Input as="textarea" rows="3" label="Deskripsi" name="description" value={form.description} onChange={handleChange} error={errors.description} />
        <FileUpload label="Foto Course" accept="image/png,image/jpeg,image/webp" value={form.image} onChange={(file) => setForm({ ...form, image: file })} helper="PNG/JPG/WEBP, maksimal 2 MB." />
        {form.image?.data && <img src={form.image.data} alt="Preview" className="mb-4 aspect-video w-full rounded-xl object-cover" />}
        <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Batal</Button><Button type="submit">Simpan</Button></div>
      </form>
    </Modal>

    <Modal open={materialCourse !== null} title={`Materi: ${materialCourse?.title || ""}`} onClose={() => setMaterialCourse(null)}>
      <form onSubmit={addLesson}>
        <Input label="Judul Materi" value={lesson.title} onChange={(event) => setLesson({ ...lesson, title: event.target.value })} placeholder="Contoh: Pengenalan React" />
        <Input as="select" label="Jenis Materi" value={lesson.type} onChange={(event) => setLesson({ ...lesson, type: event.target.value, content: "", file: null })}><option value="text">Teks</option><option value="image">Gambar</option><option value="pdf">PDF</option></Input>
        {lesson.type === "text" ? <Input as="textarea" rows="6" label="Isi Materi" value={lesson.content} onChange={(event) => setLesson({ ...lesson, content: event.target.value })} placeholder="Tulis materi sederhana di sini..." /> : <FileUpload label={lesson.type === "image" ? "File Gambar" : "File PDF"} accept={lesson.type === "image" ? "image/png,image/jpeg,image/webp" : "application/pdf"} value={lesson.file} onChange={(file) => setLesson({ ...lesson, file })} helper="Maksimal 2 MB." />}
        <div className="mb-5 flex justify-end"><Button type="submit">+ Tambah Materi</Button></div>
      </form>
      <div className="space-y-2 border-t border-gray-200 pt-4">
        <p className="mb-2 text-sm font-semibold text-gray-900">Materi saat ini ({materialCourse?.lessons?.length || 0})</p>
        {(materialCourse?.lessons || []).map((item, index) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{index + 1}. {item.title}</p><p className="text-xs text-gray-500">{item.type === "text" ? "Teks" : item.type.toUpperCase()}</p></div><Button variant="danger" onClick={() => removeLesson(item.id)}>Hapus</Button></div>)}
      </div>
    </Modal>

    <Modal open={courseToDelete !== null} title="Hapus Course" onClose={() => setCourseToDelete(null)}><p className="text-sm text-gray-600">Yakin ingin menghapus course <strong>{courseToDelete?.title}</strong>?</p><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setCourseToDelete(null)}>Batal</Button><Button variant="danger" onClick={handleDelete}>Hapus</Button></div></Modal>
  </div>;
}

export default Courses;
