import { type ReactElement } from "react";

export default function ClubSalud(): ReactElement {
  return (
    <div className="grid w-full mt-8 grid-cols-1 place-items-center gap-6 bg-purple-400/100 px-4 sm:px-6 py-0 lg:grid-cols-12 lg:items-stretch">
      <div className="w-full lg:col-span-7">
        <div className="h-full w-full text-main-azul flex flex-col justify-center items-start gap-2 px-4 sm:px-6 pt-8 sm:pt-10 pb-0 sm:pb-0 lg:px-4 lg:pt-4 lg:pb-4 xl:px-8 text-left">
          <h2 className="font-bold text-xl sm:text-2xl lg:text-4xl">
            Club salud
          </h2>
          <span>
            Club Salud es un gimnasio dentro de Medintt dirigido a recuperar,
            mejorar y fomentar la salud a través del <b>movimiento</b>.
            Utilizamos el ejercicio físico para mejorar respuestas y funciones
            alteradas por patologías crónicas, síndromes y alteraciones de
            patrones de movimiento.
          </span>
          <span>
            <ul style={{ listStyle: "none" }} className="p-0">
              <li>
                ✔ Salud Integral: Una atención completa para tu cuerpo y mente.
              </li>
              <li>
                ✔ Profesionales Especializados: Un equipo multidisciplinario
                dedicado a tu bienestar.
              </li>
              <li>
                ✔ Exclusividad y Elegancia: Un espacio diseñado para ofrecerte
                una experiencia única.
              </li>
              <li>
                ✔ Planes Personalizados: Programas adaptados a tus necesidades y
                objetivos.
              </li>
            </ul>
          </span>
        </div>
      </div>
      <div className="w-full m-0 p-0 lg:col-span-5">
        <div className="flex h-[420px] w-full items-center justify-center overflow-hidden lg:h-[480px] lg:justify-end">
          <img
            src="/resources/images/clubsalud.png"
            alt=""
            className="h-auto w-full lg:w-auto lg:h-full"
          />
        </div>
      </div>
    </div>
  );
}
