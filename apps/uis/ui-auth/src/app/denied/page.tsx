"use client";

import { MedinttButton } from "@medintt/ui";

export default function DeniedPage() {
  const contactNumber = process.env.CONTACT_NUMBER || "2994587079";
  const whatsappUrl = `https://wa.me/${contactNumber}`;
  const message =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("message")
      : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-l-4 border-yellow-500 p-8 text-center flex flex-col items-center gap-4">
        <i className="pi pi-exclamation-triangle text-6xl text-yellow-500 mb-2"></i>
        <h1 className="text-2xl font-bold text-gray-800">Acceso Denegado</h1>
        <p className="text-gray-600 text-lg">
          {message ||
            "Actualmente no tienes acceso a este servicio, comunícate con nosotros para obtenerlo."}
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <MedinttButton
            label="Contactar por WhatsApp"
            icon="pi pi-whatsapp"
            className="w-full mt-4 p-button-success"
          />
        </a>
        <MedinttButton
          label="Volver al inicio"
          icon="pi pi-arrow-left"
          className="w-full mt-2"
          severity="secondary"
          text
          onClick={() => (window.location.href = "/")}
        />
      </div>
    </div>
  );
}
