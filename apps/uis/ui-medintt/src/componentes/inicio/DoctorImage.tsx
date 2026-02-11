import { type ReactElement } from "react";

export default function DoctorImage(): ReactElement {
  return (
    <div className="relative w-full overflow-hidden">
      <h1 className="sr-only">
        Medintt: Centro Médico de Alta Complejidad en Neuquén y Patagonia
      </h1>
      <img
        src="/resources/images/home.png"
        alt="Equipo médico de Medintt - Centro Médico de Alta Complejidad en Neuquén"
        className="w-[200%] object-cover object-left sm:w-[170%] md:w-full md:object-contain"
      />
    </div>
  );
}
