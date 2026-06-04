"use client";

import { motion } from "framer-motion";
import { staggerItem } from "./motionPresets";

export default function SectionHeader({ badge, title, description, light }) {
  return (
    <motion.header variants={staggerItem} className="mx-auto max-w-3xl text-center">
      {badge && (
        <p
          className={`font-mono text-[11px] font-semibold uppercase tracking-[0.28em] ${
            light ? "text-blue-600" : "text-cyan-400"
          }`}
        >
          {badge}
        </p>
      )}
      <h2
        className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${
          light ? "text-slate-900" : "text-white"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            light ? "text-slate-600" : "text-slate-400"
          }`}
        >
          {description}
        </p>
      )}
    </motion.header>
  );
}
