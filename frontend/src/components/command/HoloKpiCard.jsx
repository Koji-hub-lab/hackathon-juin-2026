"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HoloKpiCard({
  label,
  value,
  sub,
  position = "tl",
  delay = 0,
  scrollParallax = 0,
}) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const posClass = {
    tl: "left-4 top-20 lg:left-8",
    tr: "right-4 top-20 lg:right-[22rem]",
    bl: "bottom-28 left-4 lg:left-8",
    br: "bottom-28 right-4 lg:right-[22rem]",
  }[position];

  const floatDir = position === "tl" || position === "br" ? -8 : 8;

  return (
    <motion.div
      ref={ref}
      className={`absolute z-30 w-[min(100%,200px)] ${posClass}`}
      style={{
        y: scrollParallax,
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      initial={{ opacity: 0, scale: 0.85, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 16, delay }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div
        className="rounded-2xl border border-cyan-400/25 bg-slate-900/35 p-4 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-[20px]"
        animate={{ y: [0, floatDir, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/80">
          {label}
        </p>
        <p className="mt-2 font-sans text-2xl font-bold tabular-nums tracking-tight text-white">
          {value}
        </p>
        {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
      </motion.div>
    </motion.div>
  );
}
