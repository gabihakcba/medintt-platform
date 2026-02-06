import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-dark-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Club Salud",
  description: "Medintt Platform - Club Salud",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
