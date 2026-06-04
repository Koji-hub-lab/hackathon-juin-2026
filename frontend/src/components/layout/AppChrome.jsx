"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const IMMERSIVE_PATHS = new Set(["/", "/radar"]);

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const immersive = IMMERSIVE_PATHS.has(pathname);

  if (immersive) {
    return (
      <div className="h-screen w-full overflow-hidden bg-[#030712]">{children}</div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </>
  );
}
