import Image from "next/image";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";
import { IconProps } from "../shared/Icons";

const navLinks = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/medicina-laboral", label: "Medicina Laboral", showCaret: true },
  { href: "/clubsalud", label: "Club Salud" },
  { href: "/servicios-web", label: "Servicios Web", badge: "¡Nuevo!" },
  { href: "/contacto", label: "Contacto" },
  // { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
];

const medicinaLaboralMenu = [
  {
    heading: "Para Empresas",
    items: [
      {
        href: "/medicina-laboral/empresas/examenes-salud",
        label: "Exámenes de salud",
      },
      { href: "/medicina-laboral/empresas/ausentismo", label: "Ausentismo" },
      {
        href: "/medicina-laboral/empresas/subespecialidades",
        label: "Subespecialidades",
      },
      {
        href: "/medicina-laboral/empresas/servicio-integral-salud-laboral",
        label: "Servicio integral de salud laboral",
      },
      {
        href: "/medicina-laboral/empresas/capacitaciones",
        label: "Capacitaciones",
      },
      {
        href: "/medicina-laboral/empresas/higiene-seguridad",
        label: "Higiene y Seguridad",
      },
      {
        href: "/medicina-laboral/empresas/campanas-vacunacion",
        label: "Campañas de Vacunación",
      },
    ],
  },
  {
    heading: "Para ART",
    items: [
      {
        href: "/medicina-laboral/art/examenes-periodicos",
        label: "Exámenes periódicos",
      },
      { href: "/medicina-laboral/art/accidentologia", label: "Accidentología" },
    ],
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 py-3 shadow-lg backdrop-blur">
      <div className="mx-auto flex w-full items-center justify-around gap-4 px-6 py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 text-main-azul"
        >
          <Image
            src="/resources/logos/positivo-rec.png"
            alt="Medintt"
            width={3000}
            height={3000}
            className="h-10 lg:h-12 xl:h-14 w-auto"
            priority
          />
        </Link>

        <MobileNavbar navLinks={navLinks} medicinaMenu={medicinaLaboralMenu} />
        <DesktopNavbar navLinks={navLinks} medicinaMenu={medicinaLaboralMenu} />
      </div>
    </header>
  );
}

function PhoneIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.25 5.25c0-1.243 1.007-2.25 2.25-2.25h1.386a2.25 2.25 0 0 1 1.591.659l1.362 1.362a1.5 1.5 0 0 1 .44 1.06c0 .398-.158.78-.44 1.06L7.5 8.25a11.048 11.048 0 0 0 5.25 5.25l1.182-1.182a1.5 1.5 0 0 1 1.06-.44c.398 0 .78.158 1.06.44l1.362 1.362c.377.376.586.884.586 1.414V19.5c0 1.243-1.007 2.25-2.25 2.25h-.75c-8.284 0-15-6.716-15-15v-.75Z" />
    </svg>
  );
}

function QuestionIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.625 9.75a3.375 3.375 0 1 1 6.75 0c0 1.657-1.143 2.486-2.016 3.08-.771.524-1.359.923-1.359 1.837v.008" />
      <path d="M12 17h.008" />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
