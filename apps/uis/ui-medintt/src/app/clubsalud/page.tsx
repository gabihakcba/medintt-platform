'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import Carousel from '../../componentes/shared/Carousel';

type ContactLink = {
  label: string;
  href: string;
  icon: 'whatsapp' | 'location' | 'instagram';
};

type AccordionItem = {
  title: string;
  content: ReactNode;
};

const contactLinks: ContactLink[] = [
  {
    label: '+54 9 299 593-8812',
    href: 'https://api.whatsapp.com/send/?phone=%2B5492994587079&text&type=phone_number&app_absent=0',
    icon: 'whatsapp'
  },
  {
    label: 'Puerto Rico esquina Confluencia. Cipolletti, Río Negro',
    href: 'https://maps.app.goo.gl/CgYmBWn5RuzmaQ5i8',
    icon: 'location'
  },
  {
    label: 'Club Salud',
    href: 'https://www.instagram.com/clubsalud.medintt',
    icon: 'instagram'
  }
];

const carouselImages = [
  {
    src: '/resources/cscarousel/gimnasio_01.jpg',
    alt: 'Sala de entrenamiento del Club Salud 1'
  },
  {
    src: '/resources/cscarousel/gimnasio_02.jpg',
    alt: 'Sala de entrenamiento del Club Salud 2'
  },
  {
    src: '/resources/cscarousel/gimnasio_03.jpg',
    alt: 'Sala de entrenamiento del Club Salud 3'
  },
  {
    src: '/resources/cscarousel/gimnasio_04.jpg',
    alt: 'Sala de entrenamiento del Club Salud 4'
  },
  {
    src: '/resources/cscarousel/gimnasio_05.jpg',
    alt: 'Sala de entrenamiento del Club Salud 5'
  },
  {
    src: '/resources/cscarousel/gimnasio_06.jpg',
    alt: 'Sala de entrenamiento del Club Salud 6'
  },
  {
    src: '/resources/cscarousel/gimnasio_07.jpg',
    alt: 'Sala de entrenamiento del Club Salud 7'
  },
  {
    src: '/resources/cscarousel/gimnasio_08.jpg',
    alt: 'Sala de entrenamiento del Club Salud 8'
  }
] as const;

function Icon({ type }: { type: ContactLink['icon'] }) {
  const baseProps = {
    className: 'h-5 w-5 shrink-0',
    'aria-hidden': true
  } as const;

  switch (type) {
    case 'whatsapp':
      return (
        <svg {...baseProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 2.25h4.5A7.5 7.5 0 0 1 21.75 9v6.75a6 6 0 0 1-6 6h-7.5a6 6 0 0 1-6-6V9A6.75 6.75 0 0 1 9.75 2.25Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 15.75 1.627-2.896a.75.75 0 0 1 1.017-.27l1.446.817a.75.75 0 0 0 .995-.233l1.684-2.53"
          />
        </svg>
      );
    case 'location':
      return (
        <svg {...baseProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...baseProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="4" width="16" height="16" rx="4" ry="4" />
          <circle cx="12" cy="12" r="3.25" />
          <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

function openInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function ClubSaludPage() {
  const router = useRouter();
  const [openAccordionIndex, setOpenAccordionIndex] = useState(0);

  const accordionItems: AccordionItem[] = [
    {
      title: 'Beneficios de ser socios',
      content: (
        <ul className="ml-4 list-disc space-y-2 text-sm text-main-azul/85">
          <li>Seguimiento médico sin demora.</li>
          <li>Instalaciones diseñadas para el ejercicio físico adaptado.</li>
          <li>Orientación profesional constante.</li>
          <li>Horarios flexibles.</li>
          <li>Turnos diferenciados con especialistas de Medintt.</li>
        </ul>
      )
    },
    {
      title: 'Club Salud en tu empresa',
      content: (
        <p className="text-sm leading-6 text-main-azul/85">
          El activo más importante de las empresas son las personas que trabajan en ellas. Para que tu equipo dé lo mejor,
          tiene que estar en las mejores condiciones de salud. Club Salud está diseñado para mejorar el bienestar de tu
          equipo. Incrementa la productividad, fideliza a tus trabajadores, fomenta el compañerismo y mejora la conciliación
          laboral con nuestros programas especializados. Dale un valor añadido a tu empresa con Club Salud.
        </p>
      )
    },
    {
      title: 'Asistencia, docencia e investigación',
      content: (
        <p className="text-sm leading-6 text-main-azul/85">
          Combinamos estos tres elementos para demostrar científicamente cómo el ejercicio físico mejora la vida de
          nuestros socios. Bajo la filosofía del Prof. Dr. Sergio Luscher, creemos que la salud se redefine junto a los
          profesores de educación física. Aquí, ellos también desarrollan sus conocimientos desde una nueva perspectiva
          profesional.
        </p>
      )
    },
    {
      title: 'Objetivos Club Salud',
      content: (
        <ul className="ml-4 list-disc space-y-2 text-sm text-main-azul/85">
          <li>
            Mejorar la calidad de vida y el bienestar de la población mediante el ejercicio sostenido en el tiempo como
            principal herramienta.
          </li>
          <li>
            Promover la salud a través de las prácticas físicas como herramienta terapéutica principal, adaptando el
            ejercicio como parte del tratamiento específico de cada persona.
          </li>
          <li>
            Crear programas de respaldo y asistencia para incorporar el ejercicio como parte de la rutina diaria, usando el
            movimiento como terapéutica para mejorar respuestas y funciones alteradas por patologías crónicas, síndromes y
            alteraciones de patrones de movimiento.
          </li>
        </ul>
      )
    },
    {
      title: 'Valores Club Salud',
      content: (
        <ul className="space-y-4 text-sm text-main-azul/85">
          <li className="space-y-2">
            <span className="font-bold text-main-azul">SALUD INTEGRAL</span>
            <p className="leading-6">
              En Club Salud, medicina y deporte se interrelacionan constantemente. Sostenemos que la actividad física es
              salud. Según la OMS, la salud integra todos los aspectos de la vida humana. Las dimensiones del bienestar
              abarcan el aspecto físico, social, emocional, espiritual, ambiental, ocupacional e intelectual.
            </p>
          </li>
          <li className="space-y-2">
            <span className="font-bold text-main-azul">SALUD INCLUSIVA</span>
            <p className="leading-6">
              La salud inclusiva aborda y reduce el estigma y las actitudes de discriminación, planificando servicios
              adaptados a cada paciente para asegurar accesibilidad plena.
            </p>
          </li>
          <li className="space-y-2">
            <span className="font-bold text-main-azul">ÉTICA Y CALIDAD PROFESIONAL</span>
            <p className="leading-6">
              Club Salud surge de una formación constante en un equipo multidisciplinario que brinda respaldo y seguimiento
              personalizado a cada persona. Con monitoreo y acompañamiento profesional aseguramos un servicio de calidad.
            </p>
          </li>
        </ul>
      )
    },
    {
      title: '¡Quiero unirme a Club Salud!',
      content: (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm leading-6 text-main-azul/85">
            Sumate al programa y empezá a entrenar junto a nuestro equipo multidisciplinario.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-main-azul px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-main-azul/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-azul focus-visible:ring-offset-2"
            onClick={() => router.push('/contacto')}
          >
            Contactanos ahora
          </button>
        </div>
      )
    }
  ];

  return (
    <main className="mx-auto flex max-w-[90rem] flex-col gap-14 px-6 py-10 text-main-azul lg:px-10">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5 max-w-[40rem]">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Club Salud</h1>
          <p className="text-base leading-7 text-main-azul/80">
            Club Salud es un gimnasio dentro de Medintt dirigido a recuperar, mejorar y fomentar la salud a través del
            movimiento. Utilizamos el ejercicio físico para mejorar respuestas y funciones alteradas por patologías
            crónicas, síndromes y alteraciones de patrones de movimiento. Brindamos este espacio a particulares y también
            a las empresas, donde los empleados puedan hacer ejercicio y fortalecer sus relaciones. Con el respaldo
            profesional de médicos especialistas en traumatología, deportología y educación física; dentro de un Centro
            de Salud Integral con más de diez años de trayectoria, te presentamos nuestra propuesta.
          </p>
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <img
            src="/resources/images/pesas.png"
            alt="Pesas en el gimnasio"
            className="h-auto w-full max-w-[25rem] object-contain md:max-w-[30rem] lg:max-w-[40rem] xl:max-w-[50rem]"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Sobre nuestra empresa</h2>
        <p className="text-base leading-7 text-main-azul/80">
          Club salud es un programa de ejercicio físico adaptado bajo seguimiento y prescripción médica. Sostenemos que
          el ejercicio físico es salud, y por eso diseñamos este espacio con el objetivo principal de mejorar tu calidad
          de vida y bienestar.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Club Salud en acción</h2>
        <p className="text-base leading-7 text-main-azul/80">
          Club Salud surge de la necesidad de promover la salud a través de las prácticas físicas. Desde un equipo
          multidisciplinario en formación constante, nos encargamos de dar respaldo y seguimiento personalizado a cada
          socio/a que utiliza el programa. Nos diferenciamos por preparar deportistas que compiten a nivel nacional.
          Cuidamos la longevidad de los deportistas, asegurando que su entrenamiento sea seguro y sostenible en el
          tiempo.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold">Nueva Sucursal</h2>
        <p className="text-base leading-7 text-main-azul/80">
          Nuestro nuevo gimnasio se encuentra en Confluencia esquina Puerto Rico. Es un espacio amplio y luminoso de dos
          plantas. Los horarios serán de 8.00 a 20.00 hs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-semibold">Contacto</h2>
        <div className="flex flex-col gap-3">
          {contactLinks.map(({ label, href, icon }) => (
            <button
              key={label}
              type="button"
              className="flex w-fit items-center gap-3 rounded-full border border-main-azul/40 px-5 py-3 text-sm font-medium text-main-azul transition hover:border-main-azul hover:bg-main-azul hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-main-azul focus-visible:ring-offset-2"
              onClick={() => openInNewTab(href)}
            >
              <Icon type={icon} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
        <div className="w-full lg:flex-1">
          <Carousel
            items={carouselImages.map(({ src, alt }) => (
              <figure
                key={src}
                className="relative h-72 w-full overflow-hidden rounded-3xl sm:h-80 lg:h-[24rem]"
              >
                <img src={src} alt={alt} className="h-full w-full object-cover" />
              </figure>
            ))}
            className="w-full"
            itemClassName="!p-0 !rounded-3xl !bg-transparent"
          />
        </div>
        <div className="w-full max-w-[26rem] lg:flex-1">
          <div className="flex flex-col gap-2">
            {accordionItems.map((item, index) => {
              const isOpen = openAccordionIndex === index;
              return (
                <div
                  key={item.title}
                  className="overflow-hidden rounded-2xl border border-main-azul/40 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-semibold text-main-azul"
                    onClick={() => setOpenAccordionIndex((prev) => (prev === index ? -1 : index))}
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <svg
                        className={`h-4 w-4 shrink-0 text-main-azul transition-transform ${isOpen ? 'rotate-90' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m9 5 7 7-7 7" />
                      </svg>
                      {item.title}
                    </span>
                    <span className="sr-only">{isOpen ? 'Cerrar sección' : 'Abrir sección'}</span>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-main-azul/20 bg-main-azul/5 px-5 py-4">{item.content}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
