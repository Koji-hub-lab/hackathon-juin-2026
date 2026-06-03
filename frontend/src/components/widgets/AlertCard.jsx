"use client";

import Badge from "@/components/ui/Badge";

const ICONS = { danger: "🔴", warning: "🟡", info: "🔵" };
const LABELS = { danger: "Critique", warning: "Avertissement", info: "Info" };

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AlertCard({ alert }) {
  const level = alert.level || "info";
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="text-lg leading-none">{ICONS[level] || "🔵"}</span>
          <div>
            <p className="text-sm font-medium text-white">{alert.message}</p>
            <p className="mt-1 text-xs text-gray-500">
              {alert.type} · Entrepôt #{alert.warehouseId} · {formatDate(alert.createdAt)}
            </p>
          </div>
        </div>
        <Badge variant={level}>{LABELS[level] || level}</Badge>
      </div>
    </div>
  );
}
