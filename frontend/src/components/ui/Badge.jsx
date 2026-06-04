"use client";

const VARIANTS = {
  danger: "text-red-400",
  warning: "text-amber-400",
  info: "text-slate-500",
  success: "text-emerald-400",
  neutral: "text-slate-500",
};

export default function Badge({ children, variant = "neutral" }) {
  return (
    <span
      className={`text-[10px] font-medium ${VARIANTS[variant] || VARIANTS.neutral}`}
    >
      {children}
    </span>
  );
}
