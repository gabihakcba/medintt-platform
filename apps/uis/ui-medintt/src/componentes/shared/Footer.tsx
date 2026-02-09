"use client";

import { type ReactElement } from "react";

export default function Footer(): ReactElement {
  return (
    <div className="bg-white border-t border-main-azul/10 px-3 py-6 text-main-azul sm:px-4 lg:px-6">
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between lg:items-start">
        {/* Left: Address */}
        <div className="flex flex-col items-center gap-1 text-center lg:items-start lg:text-left">
          <span className="text-sm font-semibold">
            MEDINTT - Centro Médico Privado
          </span>
          <span className="text-xs text-main-azul/80">
            Av Alem 1431 (Alem y Psje. Rawson)
          </span>
          <span className="text-xs text-main-azul/80">
            Cipolletti, Río Negro – Argentina
          </span>
        </div>

        {/* Center: Contact CTA */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <span className="text-xs text-center sm:text-left">
            📞 Contactanos y empecemos a trabajar juntos
          </span>
          <button
            className="rounded-xl bg-main-azul px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-main-azul/90"
            onClick={() => {
              window.open(
                "https://api.whatsapp.com/send/?phone=%2B5492994587079&text&type=phone_number&app_absent=0",
                "_blank",
              );
            }}
          >
            Contactar
          </button>
        </div>

        {/* Right: Logo & Copyright */}
        <div className="flex flex-col items-center gap-3 lg:items-end">
          <img
            src="/resources/logos/positivo-rec.png"
            alt="Medintt Logo"
            className="h-10 w-auto"
          />
          <span className="text-xs text-main-azul/60 text-center lg:text-right">
            © {new Date().getFullYear()} Medintt. Todos los derechos reservados.
          </span>
        </div>
      </div>
    </div>
  );
}
