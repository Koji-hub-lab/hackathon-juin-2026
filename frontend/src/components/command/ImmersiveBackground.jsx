"use client";

import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  left: `${(i * 17) % 100}%`,
  top: `${(i * 23) % 100}%`,
  size: 1 + (i % 3),
  delay: (i % 10) * 0.4,
  duration: 4 + (i % 5),
}));

export default function ImmersiveBackground({ scrollY = 0 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#030712]">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(34,211,238,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(59,130,246,0.12), transparent 50%), radial-gradient(ellipse 40% 30% at 15% 80%, rgba(6,182,212,0.08), transparent 45%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.8) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-[#030712]/90" />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(15,118,178,0.15), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-cyan-400/60"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 6px rgba(34,211,238,0.8)",
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.9, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030712_75%)]" />
    </div>
  );
}
