"use client";

import Management from "../../componentes/nosotros/Management";
import Carousel from "../../componentes/shared/Carousel";

export default function NosotrosPage() {
  return (
    <div className="flex flex-col font-secondary text-main-azul shadow-lg bg-white">
      {/* Nostros */}
      <section className="mx-auto flex w-full flex-col items-center gap-10 px-4 py-12 md:flex-row md:items-center lg:gap-16">
        <div className="relative flex w-full max-w-xs justify-center sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-[40rem]">
          <div className="relative z-10 w-full overflow-hidden rounded-[2rem]">
            <img
              src="/resources/images/we.png"
              alt="Equipo médico"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="flex w-full max-w-2xl flex-col gap-6 text-center md:text-left">
          <h2 className="text-3xl font-bold text-main-azul lg:text-4xl xl:text-5xl">
            Nosotros
          </h2>
          <p className="text-base leading-relaxed lg:text-lg xl:text-xl">
            Innovamos la salud para <strong>potenciar el bienestar.</strong>
          </p>
          <p className="text-base leading-relaxed lg:text-lg xl:text-xl">
            En Medintt, creemos que la salud es mucho más que un servicio: es
            una experiencia que transforma la calidad de vida. Con más de una
            década de trayectoria, combinamos tecnología, profesionalismo y
            calidez humana para brindar soluciones integrales en salud laboral,
            prevención y bienestar personal.
          </p>
          <p className="text-base leading-relaxed lg:text-lg xl:text-xl">
            Somos el aliado estratégico de empresas que buscan proteger a su
            equipo y de personas que desean cuidar su bienestar con un enfoque
            completo y personalizado.
          </p>
        </div>
      </section>

      {/* Equipo */}
      <div className="ml-8 flex flex-col gap-1 px-8 py-4 sm:gap-2 md:gap-3 lg:gap-4">
        <span className="text-3xl font-bold lg:text-4xl xl:text-5xl">
          Nuestro equipo
        </span>
        <p className="max-w-[35rem] text-base leading-relaxed lg:text-lg xl:text-xl">
          En Medintt, contamos con un equipo multidisciplinario de especialistas
          altamente calificados en salud laboral, medicina preventiva y
          bienestar integral.
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-7 md:flex-row">
          <Management />
        </div>
      </div>

      {/* Especialistas */}
      <div className="my-7 grid grid-cols-1 pl-8 text-main-azul lg:ml-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="flex flex-col gap-4">
            <span className="px-4 text-2xl font-bold lg:text-3xl xl:text-4xl">
              Nuestros especialistas
            </span>
            <p className="px-4 text-base leading-relaxed lg:text-lg xl:text-xl">
              Contamos con un equipo de profesionales dedicados a cuidar la
              salud de nuestros pacientes.
            </p>
            <img
              src="/resources/images/pinkrec.png"
              alt=""
              className="my-6 w-20"
            />
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="flex items-center justify-center">
            <img
              src="/resources/images/especialistas.png"
              alt=""
              className="w-[30rem] lg:w-[27rem] xl:w-[40rem]"
            />
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="flex h-full items-end justify-end">
            <img
              src="/resources/images/masaje.png"
              alt=""
              className="w-[6rem] sm:w-[8rem] md:w-[10rem] lg:w-[12rem] xl:w-[15rem]"
            />
          </div>
        </div>
      </div>

      {/* Mision */}
      <div className="flex w-full flex-col lg:flex-row items-center justify-center gap-2 bg-main-beige sm:gap-4 md:gap-6 lg:gap-7 xl:gap-8">
        <img
          src="/resources/images/puno.png"
          alt=""
          className="w-[10rem] sm:w-[12rem] md:w-[15rem] lg:w-[20rem] xl:w-[23rem]"
        />
        <div className="max-w-[50rem] bg-main-beige">
          <Carousel
            items={[
              <div
                key="mision"
                className="flex w-full max-w-[28rem] flex-col gap-4 text-main-azul bg-main-beige"
              >
                <span className="text-3xl font-bold lg:text-4xl xl:text-5xl">
                  Nuestra misión
                </span>
                <p className="text-base leading-relaxed lg:text-lg xl:text-xl">
                  Transformar la salud ocupacional y personal, ofreciendo
                  servicios innovadores y accesibles que promuevan el equilibrio
                  entre el trabajo, la prevención y el bienestar integral.
                </p>
              </div>,
              <div
                key="vision"
                className="flex w-full max-w-[28rem] flex-col gap-4 text-main-azul bg-main-beige"
              >
                <span className="text-3xl font-bold lg:text-4xl xl:text-5xl">
                  Nuestra visión
                </span>
                <p className="text-base leading-relaxed lg:text-lg xl:text-xl">
                  Ser el referente en salud laboral y bienestar integral,
                  adaptándonos a los cambios y necesidades de cada persona y
                  organización.
                </p>
              </div>,
            ]}
            itemsPerSlide={1}
            className="w-full bg-main-beige"
            itemClassName="bg-main-beige p-0 shadow-none"
          />
        </div>
      </div>

      {/* Valores */}
      <div className="my-7 flex flex-col items-center justify-center gap-4 text-main-azul">
        <span className="text-3xl font-bold lg:text-4xl xl:text-5xl">
          Nuestros valores
        </span>
        <div className="flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:items-stretch md:gap-6">
          <div className="flex w-full max-w-[22rem] flex-1 flex-col justify-between gap-5 rounded-3xl border-[3px] border-main-azul p-6">
            <span className="text-xl font-semibold lg:text-2xl">
              🔄 Evolución
            </span>
            <p className="text-base leading-relaxed lg:text-lg xl:text-xl">
              Nos reinventamos constantemente para ofrecer soluciones
              actualizadas y efectivas.
            </p>
          </div>
          <div className="flex w-full max-w-[22rem] flex-1 flex-col justify-between gap-5 rounded-3xl border-[3px] border-main-azul p-6">
            <span className="text-xl font-semibold lg:text-2xl">
              🚀 Transformación Integral
            </span>
            <p className="text-base leading-relaxed lg:text-lg xl:text-xl">
              Cada servicio busca generar un impacto positivo en la calidad de
              vida de las personas y empresas.
            </p>
          </div>
          <div className="flex w-full max-w-[22rem] flex-1 flex-col justify-between gap-5 rounded-3xl border-[3px] border-main-azul p-6">
            <span className="text-xl font-semibold lg:text-2xl">
              🤝 Compromiso Humano
            </span>
            <p className="text-base leading-relaxed lg:text-lg xl:text-xl">
              Priorizamos el bienestar de nuestros pacientes y clientes con
              atención cercana y profesional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
