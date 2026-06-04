import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";

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
        className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 antialiased"
      >
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
