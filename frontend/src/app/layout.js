import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Supply Chain Radar",
  description: "Superviseur multi-entrepôts avec prédiction IA de rupture de stock",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        suppressHydrationWarning
        className="flex min-h-screen bg-[#0b0f19] text-slate-100 antialiased"
        style={{ backgroundColor: "#0b0f19", color: "#e2e8f0" }}
      >
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 10% -20%, rgba(34,211,238,0.12), transparent 50%), radial-gradient(ellipse 80% 50% at 90% 100%, rgba(16,185,129,0.08), transparent 45%)",
          }}
        />
        <Sidebar />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
