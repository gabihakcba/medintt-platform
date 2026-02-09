import ServiceDetailLayout from '../../../../componentes/medicina-laboral/ServiceDetailLayout';

export default function EmpresasExamenesSaludPage() {
  return (
    <ServiceDetailLayout category="Para Empresas" title="Exámenes de salud">
      <>
        <p>
          La realización del Examen Médico Preocupacional es obligatoria y tiene como objetivo
          determinar la aptitud del postulante para desempeñarse en el nuevo puesto de trabajo.
        </p>

        <p className="text-main-azul">
          Se cuidan en el sistema de riesgos del trabajo los siguientes exámenes:
        </p>
        <ul className="ml-6 list-disc space-y-1 font-bold">
          <li>Preocupacionales o de ingreso.</li>
          <li>Previos a una transferencia de actividad.</li>
          <li>Posteriores a una ausencia prolongada.</li>
          <li>Previos a la terminación de la relación laboral o de egreso.</li>
        </ul>

        <p>
          Los exámenes preocupacionales o de ingreso tienen como propósito determinar la aptitud del
          postulante conforme sus condiciones psicofísicas para el desempeño de las actividades que se
          le requerirán. En ningún caso pueden ser utilizados como elemento discriminatorio para el
          empleo. Servirán, asimismo, para detectar las patologías preexistentes y, en su caso, para
          evaluar la adecuación del postulante - en función de sus características y antecedentes
          individuales- para aquellos trabajos en los que estuvieren eventualmente presentes los
          agentes de riesgo determinados por el Decreto No. 658 de fecha 24 de junio de 1996.
        </p>
        <br/>
        <p className="text-main-azul">Los contenidos mínimos de estos exámenes incluyen:</p>
        <ul className="ml-6 list-disc space-y-1 font-bold">
          <li>Examen físico completo.</li>
          <li>
            Análisis de sangre:
            <ul className="ml-6 list-disc space-y-1">
              <li>Hemograma completo, eritrosedimentación, uremia, glucemia.</li>
            </ul>
          </li>
          <li>Radiografía panorámica de tórax (frente).</li>
          <li>Análisis de orina básico.</li>
          <li>Electrocardiograma.</li>
          <li>Estudio de agudeza visual.</li>
          <li>
            Puestos y/o actividades específicas pueden requerir estudios adicionales. En caso de
            preverse la exposición a los agentes de riesgo del Decreto No. 658/96, deberán, además,
            efectuarse los estudios correspondientes a cada agente.
          </li>
        </ul>
      </>
    </ServiceDetailLayout>
  );
}
