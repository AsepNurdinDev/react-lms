import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Landing from "./pages/user/Landing";
import Dashboard from "./pages/user/Dashboard";
import Courses from "./pages/user/Courses";
import CourseDetail from "./pages/user/CourseDetail";
import Checkout from "./pages/user/Checkout";
import MyCourses from "./pages/user/MyCourses";
import Learning from "./pages/user/Learning";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCourses from "./pages/admin/Courses";
import AdminUsers from "./pages/admin/Users";
import AdminOrders from "./pages/admin/Orders";
import useLocalStorage from "./hooks/useLocalStorage";

function HomeRoute() {
  const [currentUser] = useLocalStorage("lms_current_user", null);
  return currentUser ? <Dashboard /> : <Landing />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login role="user" />} />
      <Route path="/admin/login" element={<Login role="admin" />} />
      <Route path="/register" element={<Register />} />

      <Route element={<UserLayout />}>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/checkout/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
        <Route path="/learning/:id" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
}

export default App;
