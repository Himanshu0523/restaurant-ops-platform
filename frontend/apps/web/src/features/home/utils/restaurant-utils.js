export function formatRating(rating) {
  if (!rating) return "New";
  return typeof rating === "number" ? rating.toFixed(1) : rating;
}

export function formatCuisines(cuisines) {
  if (!cuisines || !Array.isArray(cuisines)) return "";
  return cuisines.join(" • ");
}
