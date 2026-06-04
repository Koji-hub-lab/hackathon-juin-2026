"use client";

const VARIANTS = {
  danger: "border-orange-500/50 bg-orange-500/20 text-orange-400",
  warning: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  info: "border-orange-500/20 bg-black/50 text-neutral-400",
  success: "border-orange-500/25 bg-orange-500/10 text-neutral-300",
  neutral: "border-orange-500/15 bg-black/50 text-neutral-500",
};

export default function Badge({ children, variant = "neutral" }) {
  const style = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${style}`}
    >
      {children}
    </span>
  );
}
