// formatDate("2026-09-15") -> "15 September 2026"
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default formatDate;
