import ServiceDetailLayout from '../../../../componentes/medicina-laboral/ServiceDetailLayout';

export default function ArtExamenesPeriodicosPage() {
  return (
    <ServiceDetailLayout category="Para ART" title="Exámenes periódicos">
      <>
        <p className="font-semibold text-main-azul">Objetivo</p>
        <p>
          Los exámenes periódicos tienen por objetivo la detección precoz de afecciones producidas por
          aquellos agentes de riesgo determinados por el Decreto No. 658/96 a los cuales el trabajador se
          encuentre expuesto con motivo de sus tareas, con el fin de evitar el desarrollo de enfermedades
          profesionales. La realización de estos exámenes es obligatoria en todos los casos en que exista
          exposición a los agentes de riesgo mencionados en el decreto 658/96, debiendo efectuarse con las
          frecuencias y contenidos mínimos indicados en el Anexo II del decreto 1338, incluyendo un examen
          clínico anual.
        </p>

        <p className="font-semibold text-main-azul">Modalidad</p>
        <p>
          Estos exámenes pueden hacerse en las sedes del CMIFR o, si el empleador quisiera, podrían
          realizarse un operativo in Company o con la Unidad de Salud Móvil.
        </p>

        <p className="font-semibold text-main-azul">Exámenes incluidos en los exámenes periódicos</p>
        <p>
          Aquellos exámenes que respondan a la detección en fase precoz y reversible de los agentes
          químicos, físicos, biológicos o por falta de ergonomía enumerados en el Anexo II del Decreto
          658/96.
        </p>
      </>
    </ServiceDetailLayout>
  );
}
