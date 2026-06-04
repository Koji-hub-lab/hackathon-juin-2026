"use client";

const LEVEL = {
  danger: {
    label: "Critique",
    badge: "bg-red-50 text-red-700",
  },
  warning: {
    label: "Attention",
    badge: "bg-amber-50 text-amber-700",
  },
  info: {
    label: "Info",
    badge: "bg-blue-50 text-blue-700",
  },
};

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
  const meta = LEVEL[level] || LEVEL.info;

  return (
    <div className="flex items-start gap-4 rounded-xl bg-white px-2 py-3 transition-colors hover:bg-slate-50">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-slate-900">
          {alert.message}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {alert.type} · Entrepôt #{alert.warehouseId} ·{" "}
          {formatDate(alert.createdAt)}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium ${meta.badge}`}
      >
        {meta.label}
      </span>
    </div>
  );
}
