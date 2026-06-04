"use client";

import Link from "next/link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300";

const variants = {
  primary: `${base} bg-[#ff5c00] text-black glow-orange hover:scale-[1.02] hover:bg-[#ff7a1a] active:scale-[0.98]`,
  ghost: `${base} border border-white/15 bg-white/5 text-white hover:border-orange-500/50 hover:bg-orange-500/10 hover:shadow-[0_0_24px_rgba(255,92,0,0.2)]`,
  dark: `${base} border border-black/20 bg-black/80 text-orange-400 hover:bg-black`,
};

export default function GlowButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
}) {
  const cls = `${variants[variant] || variants.primary} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
