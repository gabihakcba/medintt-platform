"use client";

import { useCallback } from "react";

type SocialLink = {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "linkedin";
};

const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/medinttcentromedico",
    icon: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/medintt",
    icon: "facebook",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/medintt-salud-ocupacional-integral",
    icon: "linkedin",
  },
];

function SocialIcon({ type }: { type: SocialLink["icon"] }) {
  const baseProps = {
    className: "h-5 w-5 shrink-0",
    "aria-hidden": true,
  } as const;

  switch (type) {
    case "instagram":
      return (
        <svg
          {...baseProps}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="3.25" />
          <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...baseProps} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 5 3.66 9.14 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.89 3.79-3.89 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.64.79-1.64 1.6v1.92h2.79l-.45 2.9h-2.34v7.03C18.34 21.21 22 17.07 22 12.07Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...baseProps} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 8.75h3v12.5H3V8.75Zm6.23 0H12v1.71h.04c.42-.8 1.45-1.64 2.98-1.64 3.18 0 3.77 2.1 3.77 4.84v7.59h-3V14c0-1.43-.02-3.28-2-3.28-2.01 0-2.31 1.57-2.31 3.18v7.35H9.23V8.75Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ContactoPage() {
  const handleOpen = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <main className="relative mx-auto w-full max-w-5xl px-6 pb-16 text-main-azul sm:px-6 lg:px-10">
      <section className="grid gap-12 pt-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-16">
        <div className="space-y-12">
          <header className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight sm:text-[2.75rem]">
              Contacto
            </h1>
            <div className="space-y-1 text-lg leading-7 text-main-azul/90">
              <p>Av Alem 1431 (Alem y Psje. Rawson)</p>
              <p>Cipolletti, Río Negro – Argentina</p>
            </div>
          </header>

          <div className="mx-auto w-fit rounded-[2rem] border border-main-azul/30 p-4 md:mx-0">
            <div className="overflow-hidden rounded-[1.5rem]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.3278351233416!2d-67.98238312317824!3d-38.93933829920322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x960a30f4663b02cb%3A0x2b32488ce9bfb190!2sMEDINTT%20SRL!5e0!3m2!1sen!2sar!4v1763976727849!5m2!1sen!2sar"
                title="Ubicación de Medintt"
                className="h-[25rem] w-[25rem] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        <aside className="flex flex-col items-start gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Turnos</h2>
            <p className="text-base leading-7 text-main-azul/80">
              Lunes a Viernes de 8:30 a 20:30 hs.
              <br />
              Sólo mensajes de WhatsApp.
            </p>
            <button
              type="button"
              className="group inline-flex items-center gap-3 text-base font-medium text-main-azul transition hover:text-main-azul/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-azul/40 focus-visible:ring-offset-2"
              onClick={() =>
                handleOpen(
                  "https://api.whatsapp.com/send/?phone=%2B5492994587079&text&type=phone_number&app_absent=0"
                )
              }
            >
              <svg
                className="h-5 w-5 text-main-azul transition group-hover:text-main-azul/80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 11.5C3 6.805 6.805 3 11.5 3S20 6.805 20 11.5 16.195 20 11.5 20a8.45 8.45 0 0 1-3.68-.82l-3.3.86.88-3.22A8.42 8.42 0 0 1 3 11.5Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.75 9.75c.25 0 .5.08.71.23l.64.45a.36.36 0 0 1 .13.45l-.23.54c.35.66.9 1.21 1.55 1.56l.54-.22a.36.36 0 0 1 .45.13l.45.64c.23.33.19.77-.1 1.04-.3.29-.75.37-1.14.22-1.28-.48-2.34-1.54-2.82-2.82-.14-.39-.06-.84.22-1.13.14-.14.34-.23.55-.23Z"
                />
              </svg>
              <span className="underline decoration-main-azul/30 decoration-2 underline-offset-4">
                2994 58-7079
              </span>
            </button>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Redes</h2>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ label, href, icon }) => (
                <button
                  key={label}
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-main-azul text-main-azul transition hover:bg-main-azul hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-main-azul focus-visible:ring-offset-2"
                  aria-label={label}
                  onClick={() => handleOpen(href)}
                >
                  <SocialIcon type={icon} />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <img
        src="/resources/images/multigota.png"
        alt="Elementos gráficos institucionales"
        className="pointer-events-none absolute -bottom-2 right-4 hidden h-28 w-auto select-none sm:block"
      />
    </main>
  );
}
