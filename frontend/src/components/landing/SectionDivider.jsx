"use client";

import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.6 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
      aria-hidden
    />
  );
}
