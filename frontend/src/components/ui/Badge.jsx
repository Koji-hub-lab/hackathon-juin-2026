"use client";

const VARIANTS = {
  danger: "bg-rose-500/15 text-rose-400 border border-rose-500/35",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/35",
  info: "bg-orange-500/15 text-orange-300 border border-orange-500/35",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/35",
  neutral: "bg-white/5 text-neutral-400 border border-white/10",
};

export default function Badge({ children, variant = "neutral" }) {
  const style = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${style}`}
    >
      {children}
    </span>
  );
}
