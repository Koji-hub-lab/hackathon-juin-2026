"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const LANDING_PATHS = new Set(["/", "/radar"]);

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isLanding = LANDING_PATHS.has(pathname);

  return (
    <>
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Navbar />
        <main
          className={`min-h-0 flex-1 ${isLanding ? "overflow-y-auto overflow-x-hidden bg-[#030712]" : "overflow-hidden"}`}
        >
          {children}
        </main>
      </div>
    </>
  );
}
