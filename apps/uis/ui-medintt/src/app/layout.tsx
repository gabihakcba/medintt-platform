import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import Navbar from "../componentes/inicio/Navbar";
import Footer from "../componentes/shared/Footer";
import JsonLd from "../componentes/shared/JsonLd";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://medintt.com"),
  title: {
    default:
      "Medintt | Centro Médico de Alta Complejidad en Neuquén y Patagonia",
    template: "%s | Medintt - Salud Premium en el Sur Argentino",
  },
  description:
    "Medintt es el centro médico privado líder en el Sur de Argentina. Especialistas en alta complejidad, diagnóstico por imágenes y medicina laboral en Neuquén y Río Negro.",
  keywords: [
    "Centro Médico Neuquén",
    "Clínica Privada Patagonia",
    "Alta Complejidad Sur Argentino",
    "Medicina Laboral",
    "Diagnóstico por Imágenes",
  ],
  authors: [{ name: "Medintt" }],
  creator: "Medintt",
  publisher: "Medintt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Medintt | Centro Médico de Alta Complejidad en Neuquén",
    description:
      "Líderes en salud privada en la Patagonia. Tecnología de punta y profesionales de excelencia para tu bienestar.",
    url: "https://medintt.com",
    siteName: "Medintt",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/resources/logos/medintt_positivo_square.png", // Ensure this image is high quality for social sharing
        width: 800,
        height: 600,
        alt: "Medintt Centro Médico",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://medintt.com",
  },
  icons: {
    icon: "/resources/logos/medintt_positivo_square.png",
    apple: "/resources/logos/medintt_positivo_square.png", // Ideally add a specific apple-touch-icon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${GeistSans.className} ${GeistSans.variable} flex min-h-screen flex-col bg-white font-primary text-main-azul`}
      >
        <JsonLd />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
