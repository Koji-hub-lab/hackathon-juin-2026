"use client";

const VARIANTS = {
  danger: "bg-red-500/20 text-red-300 border border-red-500/40",
  warning: "bg-orange-500/20 text-orange-300 border border-orange-500/40",
  info: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
  success: "bg-green-500/20 text-green-300 border border-green-500/40",
  neutral: "bg-gray-700/40 text-gray-300 border border-gray-600/40",
};

export default function Badge({ children, variant = "neutral" }) {
  const style = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      {children}
    </span>
  );
}
