"use client";

export default function LandingSection({
  id,
  children,
  className = "",
  fullHeight = true,
  dark = true,
}) {
  return (
    <section
      id={id}
      className={`relative w-full scroll-mt-20 px-6 py-20 sm:px-10 lg:px-16 lg:py-28 ${
        fullHeight ? "min-h-screen flex flex-col justify-center" : ""
      } ${dark ? "bg-[#030712] text-white" : "bg-slate-50 text-slate-900"} ${className}`}
    >
      {children}
    </section>
  );
}
