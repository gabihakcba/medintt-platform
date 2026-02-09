import { type ReactElement } from "react";

export default function WhyMedintt(): ReactElement {
  return (
    <div className="flex flex-col md:flex-row bg-main-beige px-6 md:px-0 justify-start items-center gap-4 md:gap-[6rem] xl:gap-[10rem] surface-section pb-5">
      <img
        src="/resources/images/whymedintt.png"
        alt=""
        className="h-[10rem] sm:h-[15rem] md:h-[20rem] lg:h-[40rem] xl:h-[50rem]"
      />
      <span className="flex flex-col items-start font-secondary mt-8 pr-2 gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold">
          ¿Por qué elegir Medintt?
        </h2>
        <span>Tu Aliado en Salud Laboral</span>
        <span>
          <span>
            Somos más que un proveedor, somos tu socio estratégico en salud
            ocupacional.
          </span>
          <ul style={{ listStyle: "none" }} className="p-0">
            <li>
              <b>✔ Protección total para tu equipo →</b> Prevención y bienestar
              laboral.
            </li>
            <li>
              <b>✔ Cumplimiento garantizado →</b> Evitá sanciones y riesgos
              legales.
            </li>
            <li>
              <b>✔ Mayor productividad →</b> Reducí el ausentismo y promové un
              ambiente saludable.
            </li>
            <li>
              <b>✔ Soluciones certificadas →</b> Servicios avalados y efectivos.
            </li>
          </ul>
        </span>
      </span>
    </div>
  );
}
