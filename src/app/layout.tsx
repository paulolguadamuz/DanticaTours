import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const displayFont = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dantica Tours Costa Rica | Curated Guided Adventures",
  description: "Discover the raw beauty of Costa Rica with Dantica Tours. We connect travelers with volcanic highlands, cloud forests, and Pacific shores through premium guided experiences.",
  keywords: ["Costa Rica tours", "Arenal Volcano", "Monteverde", "Manuel Antonio", "Guided tours Costa Rica"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-body antialiased selection:bg-gold selection:text-volcanic">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
