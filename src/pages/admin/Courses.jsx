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
const emptyCourse = { title: "", instructor: "", category: categories[0], level: levels[0], price: "", duration: "", description: "", image: null };
const emptyLesson = { title: "", type: "text", content: "", file: null };

function Courses() {
  const [courses, setCourses] = useLocalStorage("lms_courses", initialCourses);
  const [search, setSearch] = useState("");
  const [courseModal, setCourseModal] = useState(false);
  const [materialModal, setMaterialModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [form, setForm] = useState(emptyCourse);
  const [lesson, setLesson] = useState(emptyLesson);
  const [materialCourseId, setMaterialCourseId] = useState(null);
  const [errors, setErrors] = useState({});
  const [courseToDelete, setCourseToDelete] = useState(null);

  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.instructor} ${course.category}`.toLowerCase().includes(search.toLowerCase())
  );
  const materialCourse = courses.find((course) => course.id === materialCourseId);

  function openAddCourse() {
    setEditingId(null); setForm(emptyCourse); setErrors({}); setCourseModal(true);
  }
  function openEditCourse(course) {
    setEditingId(course.id);
    setForm({
      title: course.title, instructor: course.instructor, category: course.category, level: course.level,
      price: String(course.price), duration: course.duration, description: course.description,
      image: course.imageData ? { name: "Foto saat ini", type: "image/*", data: course.imageData } : null,
    });
    setErrors({}); setCourseModal(true);
  }
  function validateCourse() {
    const next = {};
    if (!form.title.trim()) next.title = "Judul wajib diisi.";
    if (!form.instructor.trim()) next.instructor = "Instructor wajib diisi.";
    if (!form.price || Number(form.price) <= 0) next.price = "Harga harus lebih dari 0.";
    if (!form.duration.trim()) next.duration = "Durasi wajib diisi.";
    if (!form.description.trim()) next.description = "Deskripsi wajib diisi.";
    return next;
  }
  function saveCourse(event) {
    event.preventDefault();
    const nextErrors = validateCourse();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const old = courses.find((course) => course.id === editingId);
    const imageData = form.image?.data || old?.imageData || null;
    const courseData = {
      title: form.title.trim(), instructor: form.instructor.trim(), category: form.category, level: form.level,
      price: Number(form.price), duration: form.duration.trim(), description: form.description.trim(),
      image: imageData || old?.image || "/images/courses/default.svg", imageData,
    };
    if (editingId === null) {
      const id = Math.max(0, ...courses.map((course) => Number(course.id) || 0)) + 1;
      setCourses([...courses, { id, ...courseData, students: 0, lessons: [] }]);
    } else {
      setCourses(courses.map((course) => course.id === editingId ? { ...course, ...courseData } : course));
    }
    setCourseModal(false);
  }

  function deleteCourse() {
    setCourses(courses.filter((course) => course.id !== courseToDelete.id));
    setCourseToDelete(null);
  }

  function openMaterials(course) {
    setMaterialCourseId(course.id);
    setEditingLessonId(null);
    setLesson(emptyLesson);
    setMaterialModal(true);
  }

  function openEditLesson(item) {
    setEditingLessonId(item.id);
    setLesson({ title: item.title, type: item.type, content: item.content || "", file: item.file || null });
  }

  function saveLesson(event) {
    event.preventDefault();
    if (!materialCourse) return;
    if (!lesson.title.trim()) return;
    if (lesson.type === "text" && !lesson.content.trim()) return;
    if (lesson.type !== "text" && !lesson.file?.data) return;

    const currentLessons = materialCourse.lessons || [];
    const nextLesson = {
      id: editingLessonId ?? Math.max(0, ...currentLessons.map((item) => Number(item.id) || 0)) + 1,
      title: lesson.title.trim(), type: lesson.type,
      content: lesson.type === "text" ? lesson.content.trim() : "",
      file: lesson.type === "text" ? null : lesson.file,
    };
    const nextLessons = editingLessonId === null
      ? [...currentLessons, nextLesson]
      : currentLessons.map((item) => item.id === editingLessonId ? nextLesson : item);

    setCourses(courses.map((course) => course.id === materialCourse.id ? { ...course, lessons: nextLessons } : course));
    setLesson(emptyLesson);
    setEditingLessonId(null);
  }

  function deleteLesson(lessonId) {
    if (!materialCourse) return;
    const nextLessons = (materialCourse.lessons || []).filter((item) => item.id !== lessonId);
    setCourses(courses.map((course) => course.id === materialCourse.id ? { ...course, lessons: nextLessons } : course));
    if (editingLessonId === lessonId) { setEditingLessonId(null); setLesson(emptyLesson); }
  }

  const columns = [
    { key: "title", label: "Judul" },
    { key: "category", label: "Kategori", render: (course) => <Badge color="indigo">{course.category}</Badge> },
    { key: "price", label: "Harga", render: (course) => formatCurrency(course.price) },
    { key: "lessons", label: "Materi", render: (course) => course.lessons?.length || 0 },
    { key: "actions", label: "Aksi", render: (course) => (
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => openEditCourse(course)}>Edit</Button>
        <Button variant="secondary" onClick={() => openMaterials(course)}>Materi</Button>
        <Button variant="danger" onClick={() => setCourseToDelete(course)}>Hapus</Button>
      </div>
    ) },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Courses</h1><p className="mt-1 text-sm text-gray-500">Kelola course, foto, dan materi.</p></div>
        <Button onClick={openAddCourse}>+ Tambah Course</Button>
      </div>
      <div className="mb-4 max-w-md"><Input label="Cari course" placeholder="Judul, instructor, kategori" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      <DataTable columns={columns} data={filteredCourses} emptyMessage="Tidak ada course yang ditemukan." />

      <Modal open={courseModal} title={editingId === null ? "Tambah Course" : "Edit Course"} onClose={() => setCourseModal(false)}>
        <form onSubmit={saveCourse} noValidate>
          <Input label="Judul" name="title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} error={errors.title} />
          <Input label="Instructor" name="instructor" value={form.instructor} onChange={(event) => setForm({ ...form, instructor: event.target.value })} error={errors.instructor} />
          <div className="grid gap-x-4 sm:grid-cols-2">
            <Input as="select" label="Kategori" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.map((item) => <option key={item}>{item}</option>)}</Input>
            <Input as="select" label="Level" value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}>{levels.map((item) => <option key={item}>{item}</option>)}</Input>
            <Input label="Harga (Rp)" type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} error={errors.price} />
            <Input label="Durasi" placeholder="Contoh: 8 Jam" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} error={errors.duration} />
          </div>
          <Input as="textarea" rows="4" label="Deskripsi" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} error={errors.description} />
          <FileUpload label="Foto Course" accept="image/png,image/jpeg,image/webp" value={form.image} onChange={(file) => setForm({ ...form, image: file })} helper="JPG/PNG/WEBP, maksimal 1 MB." />
          {form.image?.data && <img src={form.image.data} alt="Preview course" className="mb-4 aspect-video w-full rounded-xl object-cover" />}
          <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setCourseModal(false)}>Batal</Button><Button type="submit">Simpan Course</Button></div>
        </form>
      </Modal>

      <Modal open={materialModal} title={`Materi — ${materialCourse?.title || ""}`} onClose={() => setMaterialModal(false)}>
        <form onSubmit={saveLesson}>
          <div className="mb-4 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">{editingLessonId === null ? "Tambah materi baru ke course ini." : "Edit materi yang dipilih lalu simpan perubahan."}</div>
          <Input label="Judul Materi" value={lesson.title} onChange={(event) => setLesson({ ...lesson, title: event.target.value })} placeholder="Contoh: Pengenalan React" />
          <Input as="select" label="Jenis Materi" value={lesson.type} onChange={(event) => setLesson({ ...lesson, type: event.target.value, content: "", file: null })}>
            <option value="text">Teks</option><option value="image">Gambar</option><option value="pdf">PDF</option>
          </Input>
          {lesson.type === "text" ? (
            <Input as="textarea" rows="8" label="Isi Materi" value={lesson.content} onChange={(event) => setLesson({ ...lesson, content: event.target.value })} placeholder="Tulis materi pembelajaran..." />
          ) : (
            <FileUpload label={lesson.type === "image" ? "Upload Gambar Materi" : "Upload PDF Materi"} accept={lesson.type === "image" ? "image/png,image/jpeg,image/webp" : "application/pdf"} value={lesson.file} onChange={(file) => setLesson({ ...lesson, file })} helper="Maksimal 1 MB untuk demo frontend." />
          )}
          {lesson.type === "image" && lesson.file?.data && <img src={lesson.file.data} alt="Preview materi" className="mb-4 max-h-60 w-full rounded-lg object-contain" />}
          <div className="mb-5 flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => { setLesson(emptyLesson); setEditingLessonId(null); }}>Reset</Button><Button type="submit">{editingLessonId === null ? "+ Tambah Materi" : "Simpan Perubahan"}</Button></div>
        </form>

        <div className="border-t border-gray-200 pt-4">
          <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-gray-900">Daftar Materi</p><span className="text-xs text-gray-500">{materialCourse?.lessons?.length || 0} materi</span></div>
          <div className="space-y-2">
            {(materialCourse?.lessons || []).map((item, index) => (
              <div key={item.id} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="font-medium text-gray-900">{index + 1}. {item.title}</p><p className="mt-1 text-xs text-gray-500">{item.type === "text" ? "Teks" : item.type === "image" ? `Gambar · ${item.file?.name || "file"}` : `PDF · ${item.file?.name || "file"}`}</p></div>
                  <div className="flex shrink-0 gap-2"><Button variant="secondary" onClick={() => openEditLesson(item)}>Edit</Button><Button variant="danger" onClick={() => deleteLesson(item.id)}>Hapus</Button></div>
                </div>
              </div>
            ))}
            {!materialCourse?.lessons?.length && <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">Belum ada materi.</p>}
          </div>
        </div>
      </Modal>

      <Modal open={courseToDelete !== null} title="Hapus Course" onClose={() => setCourseToDelete(null)}>
        <p className="text-sm text-gray-600">Yakin ingin menghapus <strong>{courseToDelete?.title}</strong>? Materi course juga akan ikut terhapus dari data browser.</p>
        <div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setCourseToDelete(null)}>Batal</Button><Button variant="danger" onClick={deleteCourse}>Ya, Hapus</Button></div>
      </Modal>
    </div>
  );
}

export default Courses;
