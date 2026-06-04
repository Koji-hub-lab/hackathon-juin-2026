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
        className="flex h-screen overflow-hidden bg-[#080b11] text-slate-100 antialiased"
      >
        <Sidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="min-h-0 flex-1 overflow-hidden p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
