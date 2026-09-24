export function formatDistance(distanceInKm) {
  if (distanceInKm === undefined || distanceInKm === null) return "";
  if (typeof distanceInKm === "string") return distanceInKm;
  return `${distanceInKm.toFixed(1)} km`;
}
