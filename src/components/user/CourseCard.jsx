import Badge from "../common/Badge";
import Button from "../common/Button";
import formatCurrency from "../../utils/formatCurrency";

function CourseCard({ course, owned = false }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
      <img src={course.image} alt={course.title} className="aspect-video w-full object-cover" />

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge color="indigo">{course.category}</Badge>
          <Badge>{course.level}</Badge>
        </div>

        <h3 className="font-semibold text-gray-900">{course.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{course.instructor}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-semibold text-indigo-600">{formatCurrency(course.price)}</span>
          {owned ? (
            <Button to={`/learning/${course.id}`}>Mulai Belajar</Button>
          ) : (
            <Button to={`/courses/${course.id}`} variant="secondary">
              Lihat Detail
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
