# Simple Responsive React LMS

Aplikasi Learning Management System sederhana untuk tugas kuliah Frontend Programming.
Hanya frontend: data dummy dan localStorage, tanpa backend.

**Stack:** React, Vite, Tailwind CSS, React Router DOM

## Menjalankan

```bash
npm install
npm run dev      # development
npm run build    # build production
npm run lint     # cek kode
```

## Akun Demo

| Role  | Email          | Password |
| ----- | -------------- | -------- |
| Admin | admin@lms.test | admin123 |
| User  | user@lms.test  | user123  |

Kamu juga bisa membuat akun baru lewat halaman `/register`.

## Route

| User                                                                   | Admin                                       |
| ---------------------------------------------------------------------- | ------------------------------------------- |
| `/login`, `/register`, `/`, `/courses`, `/courses/:id`, `/checkout/:id`, `/my-courses`, `/learning/:id` | `/admin`, `/admin/courses`, `/admin/users`, `/admin/orders` |

## Struktur Singkat

```
src/
  components/  common (Button, Modal, Badge, Input, EmptyState, Loading)
               user (Navbar, CourseCard, CourseGrid)
               admin (AdminSidebar, AdminHeader, StatCard, DataTable)
  layouts/     UserLayout, AdminLayout (memakai <Outlet />)
  pages/       auth, user, admin
  data/        courses.js, users.js, orders.js (data awal)
  hooks/       useLocalStorage.js
  utils/       formatCurrency.js, formatDate.js, getMyCourseIds.js
```

## Key localStorage

`lms_courses`, `lms_users`, `lms_orders`, `lms_current_user`, `lms_progress`.
Untuk reset data ke kondisi awal, jalankan `localStorage.clear()` di console browser lalu refresh.
