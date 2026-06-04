"use client";

import { motion } from "framer-motion";

const TITLE = "Supply Chain Command Center";

export default function AnimatedTitle() {
  return (
    <div className="pointer-events-none relative z-20 text-center">
      <motion.h1
        className="flex flex-wrap justify-center gap-[0.02em] text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        initial="hidden"
        animate="visible"
      >
        {TITLE.split("").map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            variants={{
              hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            animate={{
              y: [0, -3, 0],
              textShadow: [
                "0 0 20px rgba(34,211,238,0.3)",
                "0 0 32px rgba(34,211,238,0.65)",
                "0 0 20px rgba(34,211,238,0.3)",
              ],
            }}
            transition={{
              delay: i * 0.035,
              duration: 0.45,
              type: "spring",
              stiffness: 120,
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              textShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              color: char === " " ? "transparent" : "#f0f9ff",
              display: "inline-block",
              minWidth: char === " " ? "0.35em" : undefined,
            }}
            className={char !== " " ? "text-cyan-50" : ""}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Surveillance temps réel de l&apos;ensemble du réseau logistique
      </motion.p>
    </div>
  );
}
