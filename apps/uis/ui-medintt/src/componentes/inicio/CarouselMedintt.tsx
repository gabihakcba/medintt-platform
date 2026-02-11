'use client';

import { ReactElement, useEffect, useMemo, useState } from 'react';

import Carousel from '../shared/Carousel';

type CarouselMedinttProps = {
  className?: string;
};

type CarouselItemConfig = {
  title: string;
  description: string;
  highlights: string[];
  image: {
    src: string;
    alt: string;
  };
  cta: {
    label: string;
    href: string;
  };
};

const ITEM_LAYOUT_CLASSES =
  'flex flex-col gap-8 md:gap-10 lg:flex-row lg:items-center lg:gap-10 xl:gap-20';

const STACKED_WRAPPER_CLASSES = 'flex w-full flex-col gap-6';

const IMAGE_CLASSES =
  'mx-auto w-full max-w-[10rem] sm:max-w-sm md:max-w-none md:w-[28rem] lg:w-[25rem] [@media(min-width:1040px)]:w-[28rem] [@media(min-width:1200px)]:w-[35rem] [@media(min-width:1300px)]:w-[36rem]';

const DESCRIPTION_CLASSES =
  'font-secondary text-base leading-6 text-main-azul/80 sm:text-lg sm:leading-7 lg:text-base lg:leading-6 xl:text-lg xl:leading-7';

const CTA_BUTTON_CLASSES =
  'w-max self-center rounded-2xl bg-main-azul px-4 py-2 text-sm font-secondary font-bold text-white transition hover:bg-main-azul/90 sm:px-6 sm:text-base md:px-8 md:text-lg';

const CAROUSEL_ITEMS: CarouselItemConfig[] = [
  {
    title: 'Para empresas',
    description:
      'Protegé tu equipo y aumentá la productividad. Diseñamos planes personalizados para el bienestar laboral, cumpliendo normativas y reduciendo riesgos.',
    highlights: [
      '📌 Consultoría en salud ocupacional',
      '📌 Programas de prevención y bienestar',
      '📌 Evaluaciones médicas y certificaciones',
    ],
    image: {
      src: '/resources/images/empresas.png',
      alt: 'Para empresas',
    },
    cta: {
      label: '💼 Solicitar una consultoría',
      href: 'https://api.whatsapp.com/send/?phone=%2B5492994587079&text&type=phone_number&app_absent=0',
    },
  },
  {
    title: 'Para pacientes',
    description: 'Accedé a atención médica integral y personalizada.',
    highlights: [
      '📌 Consultas médicas',
      '📌 Chequeos preventivos',
      '📌 Rehabilitación y bienestar emocional',
    ],
    image: {
      src: '/resources/images/pacientes.png',
      alt: 'Para pacientes',
    },
    cta: {
      label: '👨‍⚕️ Solicitar turno',
      href: 'https://api.whatsapp.com/send/?phone=%2B5492994587079&text&type=phone_number&app_absent=0',
    },
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function CarouselItem({ config }: { config: CarouselItemConfig }): ReactElement {
  return (
    <div className={ITEM_LAYOUT_CLASSES}>
      <img src={config.image.src} alt={config.image.alt} className={IMAGE_CLASSES} />
      <div className="flex w-full flex-col justify-center gap-8 md:gap-10 lg:gap-12">
        <span className="flex flex-col gap-4 md:gap-6">
          <span className="font-primary text-2xl font-bold leading-snug md:text-3xl md:leading-snug xl:text-4xl xl:leading-tight">
            {config.title}
          </span>
          <span className={DESCRIPTION_CLASSES}>
            {config.description}
            <ul className="mt-3 list-none space-y-1.5 text-base leading-6 sm:mt-4 sm:space-y-2 sm:text-lg sm:leading-7 lg:text-base lg:leading-6 xl:text-lg xl:leading-7">
              {config.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </span>
        </span>
        <button
          className={CTA_BUTTON_CLASSES}
          onClick={() => {
            window.open(config.cta.href, '_blank');
          }}
        >
          {config.cta.label}
        </button>
      </div>
    </div>
  );
}

export default function CarouselMedintt({ className }: CarouselMedinttProps): ReactElement {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleMediaQuery = (target: MediaQueryList | MediaQueryListEvent) => {
      setIsSmallScreen(target.matches);
    };

    handleMediaQuery(mediaQuery);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleMediaQuery);
      return () => mediaQuery.removeEventListener('change', handleMediaQuery);
    }

    mediaQuery.addListener(handleMediaQuery);
    return () => mediaQuery.removeListener(handleMediaQuery);
  }, []);

  const carouselItems = useMemo(
    () => CAROUSEL_ITEMS.map((item) => <CarouselItem key={item.title} config={item} />),
    []
  );

  if (isSmallScreen) {
    return (
      <div className={cn(STACKED_WRAPPER_CLASSES, className)}>
        {CAROUSEL_ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex h-full flex-col rounded-3xl bg-white/90 backdrop-blur-sm"
          >
            <CarouselItem config={item} />
          </div>
        ))}
      </div>
    );
  }

  return <Carousel className={className} items={carouselItems} itemsPerSlide={1} />;
}
