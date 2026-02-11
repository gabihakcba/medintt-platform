"use client";

import { useState } from "react";

const specialties = [
  {
    title: "Clínica Médica",
    drs: ["Dra. Chacón Cecilia", "Dra. Villegas Cristina"],
  },
  {
    title: "Deportología",
    drs: ["Dr. Luscher Sergio"],
  },
  {
    title: "Enfermería",
    drs: ["Morales Romina"],
  },
  {
    title: "Diagnóstico por Imágenes",
    drs: ["Dr. Pereyra Werfil"],
  },
  {
    title: "Terapias biológicas y medicina regenerativa",
    drs: ["Dr. Franchi Oscar", "Dra. Álavarez Claudia"],
  },
  {
    title: "Otorrinolaringología",
    drs: ["Dra. Fernández Olga"],
  },
  {
    title: "Traumatología",
    drs: ["Dr. Franchi Oscar", "Dr. Luscher Sergio", "Dra. Álvarez Claudia"],
  },
  {
    title: "Cardiología",
    drs: ["Dr. Pero Bellido Simón"],
  },
  {
    title: "Nutrición",
    drs: ["Lic. Martínez Claudio"],
  },
  {
    title: "Psicología",
    drs: ["Lic. Grassi Luciana", "Lic. Rossi Stefanía"],
  },
  {
    title: "Ecografía",
    drs: ["Dra. Pereyra Paula"],
  },
  {
    title: "Cirugía General",
    drs: ["Dr. Briñón Miguel"],
  },
  {
    title: "Gastroenterología",
    drs: ["Dra. Lloves Adriana"],
  },
  {
    title: "Clínica Quirúrgica",
    drs: ["Dr. Filipelli Fernando"],
  },
  {
    title: "Kinesiología",
    drs: ["Lic. Gatica Edgar", "Lic. Cobos Esteban"],
  },
  {
    title: "Neurología",
    drs: ["Dra. Constantini Pablo"],
  },
];

export default function ServiciosPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSpecialty = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex min-h-[50rem] flex-col items-center justify-center bg-main-azul p-4 px-8 lg:px-12 xl:px-24 shadow-lg">
      <div className="w-full rounded-tl-[50px] rounded-br-[50px] bg-white p-6 text-main-azul shadow-md sm:p-8">
        <div className="grid grid-cols-1 gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {specialties.map((specialty, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={specialty.title}
                className={`relative lg:h-16 xl:h-24 flex flex-col justify-center overflow-visible rounded-3xl border border-main-azul/20 bg-white/90 p-4 shadow-sm transition-transform hover:scale-[1.02] ${
                  isOpen ? "z-50" : "z-0"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSpecialty(index)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                  aria-expanded={openIndex === index}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/resources/images/gota.png"
                      alt=""
                      className="h-6 w-6 object-contain xl:h-8 xl:w-8"
                    />
                    <span className="text-base font-medium lg:text-lg">
                      {specialty.title}
                    </span>
                  </div>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 text-main-azul transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      fill="currentColor"
                      d="M12 15.5a1 1 0 0 1-.71-.29l-5-5a1 1 0 1 1 1.42-1.42L12 13.08l4.29-4.29a1 1 0 1 1 1.42 1.42l-5 5a1 1 0 0 1-.71.29Z"
                    />
                  </svg>
                </button>
                {isOpen && (
                  <div className="absolute left-1/2 top-full z-50 mt-3 w-full -translate-x-1/2 rounded-3xl border border-main-azul/20 bg-white p-4 shadow-xl">
                    <div className="flex flex-col gap-2">
                      {specialty.drs.map((doctor) => (
                        <span
                          key={doctor}
                          className="rounded-2xl bg-main-azul/10 px-3 py-2 text-sm text-main-azul/90"
                        >
                          {doctor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
