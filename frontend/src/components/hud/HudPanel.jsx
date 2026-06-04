"use client";

/** Carte style Donezo — blanc, ombre douce, coins arrondis. */
export default function HudPanel({
  title,
  subtitle,
  children,
  className = "",
  noPadding = false,
}) {
  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md ${className}`}
    >
      <div className="shrink-0 border-b border-slate-100 px-6 py-5">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      <div className={`min-h-0 flex-1 overflow-auto ${noPadding ? "" : "p-6"}`}>
        {children}
      </div>
    </div>
  );
}
