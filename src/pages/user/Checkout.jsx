import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import Loading from "../../components/common/Loading";
import useLocalStorage from "../../hooks/useLocalStorage";
import getMyCourseIds from "../../utils/getMyCourseIds";
import formatCurrency from "../../utils/formatCurrency";
import { courses as initialCourses } from "../../data/courses";
import { orders as initialOrders } from "../../data/orders";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser] = useLocalStorage("lms_current_user", null);
  const [courses, setCourses] = useLocalStorage("lms_courses", initialCourses);
  const [orders, setOrders] = useLocalStorage("lms_orders", initialOrders);
  const [processing, setProcessing] = useState(false);

  const course = courses.find((item) => item.id === Number(id));

  if (!course) {
    return (
      <EmptyState title="Course tidak ditemukan" message="Course yang ingin dibeli tidak ada.">
        <Button to="/courses">Kembali ke Daftar Course</Button>
      </EmptyState>
    );
  }

  // Cegah pembelian ganda
  if (getMyCourseIds(orders, currentUser.id).includes(course.id)) {
    return (
      <EmptyState title="Course sudah dibeli" message="Kamu sudah memiliki course ini.">
        <Button to={`/learning/${course.id}`}>Mulai Belajar</Button>
      </EmptyState>
    );
  }

  function handleConfirm() {
    setProcessing(true);

    // setTimeout hanya untuk simulasi proses pembayaran
    setTimeout(() => {
      const newOrder = {
        id: Math.max(0, ...orders.map((order) => order.id)) + 1,
        userId: currentUser.id,
        userName: currentUser.name,
        courseId: course.id,
        courseTitle: course.title,
        price: course.price,
        status: "Lunas",
        date: new Date().toISOString().slice(0, 10),
      };

      setOrders([...orders, newOrder]);
      setCourses(courses.map((item) => (item.id === course.id ? { ...item, students: item.students + 1 } : item)));

      navigate("/my-courses", { state: { message: `Berhasil membeli course "${course.title}".` } });
    }, 800);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Course</h2>
        <div className="flex items-center gap-4">
          <img src={course.image} alt={course.title} className="h-16 w-28 rounded-lg object-cover" />
          <div>
            <p className="font-medium">{course.title}</p>
            <p className="text-sm text-gray-500">{course.instructor}</p>
          </div>
        </div>

        <h2 className="mb-2 mt-6 font-semibold">Informasi Pembeli</h2>
        <p className="text-sm text-gray-600">{currentUser.name}</p>
        <p className="text-sm text-gray-600">{currentUser.email}</p>

        <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Harga</span>
            <span>{formatCurrency(course.price)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-indigo-600">{formatCurrency(course.price)}</span>
          </div>
        </div>

        {processing ? (
          <Loading text="Memproses pembelian..." />
        ) : (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleConfirm} className="sm:flex-1">
              Konfirmasi Pembelian
            </Button>
            <Button to={`/courses/${course.id}`} variant="secondary">
              Batal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
