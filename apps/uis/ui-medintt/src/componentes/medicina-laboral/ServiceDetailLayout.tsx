'use client';

import { type ReactNode } from 'react';

interface ServiceDetailLayoutProps {
  category: string;
  title: string;
  children?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

export default function ServiceDetailLayout({
  category,
  title,
  children,
  imageSrc = '/resources/images/laboral.png',
  imageAlt = 'Profesional trabajando en un portátil'
}: ServiceDetailLayoutProps) {
  return (
    <main className="flex w-full flex-col gap-12 pb-16 pt-12 text-main-azul">
      <div className="flex flex-col-reverse lg:flex-row w-full">
        <div className="w-full lg:w-fit pt-10 lg:pt-0 items-center justify-center lg:justify-start hidden md:flex">
          <img src={imageSrc} alt={imageAlt} className="h-full w-[20rem] lg:w-[40rem] object-contain" />
        </div>

        <section className="flex flex-1 items-center h-full justify-start pl-4 pr-6 sm:pl-10 sm:pr-10 lg:pl-12 lg:pr-12">
          <div className="w-full rounded-[2.5rem] bg-[#d9d9d9] h-full px-10 py-12 text-main-azul shadow-md sm:px-12">
            {/* <h2 className="text-2xl font-semibold">{category}</h2> */}
            <p className="mt-4 text-xl font-bold text-main-azul/90">{title}</p>
            {children ? (
              <div className="mt-6 min-h-[8rem] space-y-3 text-base leading-7 text-main-azul/80">{children}</div>
            ) : (
              <div className="mt-6 min-h-[8rem] text-base leading-7 text-main-azul/60">
                Próximamente encontrarás más información aquí.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
