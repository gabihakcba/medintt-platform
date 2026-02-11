import ServiceDetailLayout from '../../../../componentes/medicina-laboral/ServiceDetailLayout';

export default function ArtAccidentologiaPage() {
  return (
    <ServiceDetailLayout category="Para ART" title="Accidentología">
      <>
        <p className="font-semibold text-main-azul">Objetivo</p>
        <p>
          Brindar un servicio de atención, diagnóstico, tratamiento y rehabilitación integral de
          accidentes laborales y enfermedades profesionales para cualquier nivel de complejidad, desde
          que el paciente llega a la clínica hasta lograr la reinserción precoz al trabajo, por medio de
          un abordaje interdisciplinario.
        </p>

        <p className="font-semibold text-main-azul">Modalidad</p>
        <p>Somos expertos en accidentología laboral:</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Trabajamos como prestadores de todas las ART.</li>
          <li>Con atención las 24 hs, los 365 días del año.</li>
          <li>
            Equipo multidisciplinario con todas las especialidades relacionadas con la Medicina y
            Accidentología Laboral.
          </li>
          <li>Preparados para atender cualquier patología laboral.</li>
        </ul>
      </>
    </ServiceDetailLayout>
  );
}
