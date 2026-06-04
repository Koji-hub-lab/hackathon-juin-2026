"use client";

import Badge from "@/components/ui/Badge";

const LABELS = { danger: "Critique", warning: "Watch", info: "Info" };

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
    <div className="rounded border border-orange-500/20 bg-black/40 p-3 transition-colors hover:border-orange-500/35">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm leading-snug text-neutral-200">{alert.message}</p>
          <p className="mt-1 font-mono text-[10px] text-neutral-500">
            {alert.type} · #{alert.warehouseId} · {formatDate(alert.createdAt)}
          </p>
        </div>
        <Badge variant={level}>{LABELS[level] || level}</Badge>
      </div>
    </div>
  );
}
