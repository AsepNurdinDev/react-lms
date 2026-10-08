// Course milik user = order milik user dengan status "Lunas"
function getMyCourseIds(orders, userId) {
  return orders
    .filter((order) => order.userId === userId && order.status === "Lunas")
    .map((order) => order.courseId);
}

export default getMyCourseIds;
