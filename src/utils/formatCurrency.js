// formatCurrency(150000) -> "Rp150.000"
function formatCurrency(amount) {
  const number = String(Math.round(Number(amount) || 0));
  return "Rp" + number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default formatCurrency;
