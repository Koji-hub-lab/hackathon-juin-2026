"use client";

const LEVEL = {
  danger: {
    label: "Critique",
    dot: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]",
    text: "text-red-400",
  },
  warning: {
    label: "Attention",
    dot: "bg-amber-400",
    text: "text-amber-400/90",
  },
  info: {
    label: "Info",
    dot: "bg-slate-500",
    text: "text-slate-500",
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
    <div className="flex gap-3 rounded-lg border border-slate-800/60 bg-slate-950/20 px-4 py-3 transition-colors hover:border-slate-700/80">
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`}
        title={meta.label}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-slate-200">{alert.message}</p>
        <p className="mt-1 text-xs text-slate-500">
          {alert.type} · Entrepôt #{alert.warehouseId} ·{" "}
          {formatDate(alert.createdAt)}
        </p>
      </div>
      <span className={`shrink-0 text-[10px] font-medium ${meta.text}`}>
        {meta.label}
      </span>
    </div>
  );
}
