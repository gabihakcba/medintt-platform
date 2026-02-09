import { type ReactElement } from "react";

export default function Services(): ReactElement {
  return (
    <div className="flex flex-col text-main-azul mt-7 gap-6 font-secondary px-0 pt-5 sm:px-2 md:px-4 lg:px-10 xl:px-[15rem]">
      <h2 className="text-3xl xl:text-4xl font-bold">Servicios Destacados</h2>
      <div className="grid grid-cols-1 gap-6 px-0 sm:px-4 md:px-6 lg:px-10 xl:px-12 mx-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex flex-col h-full border-[3px] border-main-azul rounded-3xl overflow-hidden">
            <h3 className="text-xl font-bold p-4">
              🏢 Salud Ocupacional para Empresas
            </h3>
            <div className="flex flex-col justify-between h-full">
              <span className="px-4">
                Cuidá a tu equipo con prevención y bienestar.Evaluaciones
                médicas, capacitaciones en seguridad y programas personalizados.
              </span>
              <ul style={{ listStyle: "none" }} className="px-4">
                <li>📌 Consultoría en salud laboral</li>
                <li>📌 Certificaciones</li>
                <li>📌 Monitoreo continuo</li>
              </ul>
              <img
                src="/resources/images/image-photoroom.png"
                className="w-44 self-end"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="h-full border-[3px] border-main-azul rounded-3xl flex flex-col p-4 gap-4">
                <h3 className="text-xl font-bold">
                  🩺 Chequeos Médicos Personalizados
                </h3>
                <span>
                  Detectá problemas antes de que sean graves.Chequeos de rutina
                  con especialistas en medicina preventiva y salud integral.
                </span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="h-full border-[3px] border-main-azul rounded-3xl flex flex-col p-4 gap-4">
                <span>
                  Recuperate y volvé al trabajo con confianza.Terapias
                  especializadas para acelerar la recuperación y prevenir
                  lesiones.
                </span>
                <h3 className="text-xl font-bold">
                  🏥 Fisioterapia y Rehabilitación
                </h3>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="h-full border-[3px] border-main-azul rounded-3xl flex flex-col p-4 gap-4">
                <span>
                  Prevenir es vivir mejor.Evaluaciones de salud y programas de
                  prevención adaptados a cada persona.
                </span>
                <h3 className="text-xl font-bold">
                  🛡️ Medicina Preventiva Integral
                </h3>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="h-full border-[3px] border-main-azul rounded-3xl flex flex-col p-4 gap-4">
                <h3 className="text-xl font-bold">
                  🧠 Psicología Laboral y Bienestar Mental
                </h3>
                <span>
                  Salud emocional para un mejor desempeño.Asesoramiento, manejo
                  del estrés y programas de bienestar.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
