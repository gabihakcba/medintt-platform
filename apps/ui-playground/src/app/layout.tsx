import type { Metadata } from "next";
import "./globals.css";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Sidebar from "@/components/Sidebar";
import { PrimeReactProvider } from "primereact/api";

export const metadata: Metadata = {
  title: "Medintt UI Playground",
  description: "Laboratorio de componentes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <PrimeReactProvider>
          <Sidebar/>
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
