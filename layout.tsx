import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TANЫM — Таным әлемі",
  description:
    "TANЫM — бастауыш сынып оқушыларының зейінін, жадын, логикасын, қабылдауын және пішіндерді тану дағдыларын дамытатын интерактивті білім беру платформасы.",
  keywords: ["Таным әлемі", "инклюзивті білім", "ойындар", "зейін", "жад", "логика", "пішіндер"],
  applicationName: "TANЫM",
};

export const viewport: Viewport = {
  themeColor: "#172C53",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="kk">
      <body className="bg-canvas text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-2xl focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          Негізгі мазмұнға өту
        </a>
        {children}
      </body>
    </html>
  );
}
