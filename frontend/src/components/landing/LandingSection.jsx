"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "./motionPresets";

export default function LandingSection({
  id,
  children,
  className = "",
  fullHeight = true,
  dark = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      className={`relative w-full px-6 py-20 sm:px-10 lg:px-16 lg:py-28 ${
        fullHeight ? "min-h-screen flex flex-col justify-center" : ""
      } ${dark ? "bg-[#030712] text-white" : "bg-slate-50 text-slate-900"} ${className}`}
    >
      {children}
    </motion.section>
  );
}
