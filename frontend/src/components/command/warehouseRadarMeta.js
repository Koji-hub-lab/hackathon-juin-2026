/** Métadonnées 3D des hubs (positions radar polaire). */
export const RADAR_WAREHOUSES = [
  { name: "Douala", warehouseId: 1, angleDeg: 205, radius: 2.5 },
  { name: "Yaoundé", warehouseId: 2, angleDeg: 65, radius: 1.7 },
  { name: "Bafoussam", warehouseId: 3, angleDeg: 130, radius: 3.0 },
  { name: "Garoua", warehouseId: 4, angleDeg: -35, radius: 3.3 },
];

export function polarToVec3(angleDeg, radius, y = 0) {
  const a = (angleDeg * Math.PI) / 180;
  return [Math.cos(a) * radius, y, Math.sin(a) * radius];
}

export function activityColor(fillPercent, alert) {
  if (alert) return "#f97316";
  if (fillPercent < 30) return "#f97316";
  if (fillPercent < 55) return "#22d3ee";
  return "#34d399";
}
