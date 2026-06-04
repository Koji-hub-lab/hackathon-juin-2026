"use client";

export default function GlassCard({
  children,
  className = "",
  glow = false,
  accent = false,
}) {
  return (
    <div
      className={`glass-panel rounded-2xl ${glow ? "glow-orange" : ""} ${
        accent
          ? "border-orange-500/30 bg-gradient-to-br from-orange-600/20 via-transparent to-transparent"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
