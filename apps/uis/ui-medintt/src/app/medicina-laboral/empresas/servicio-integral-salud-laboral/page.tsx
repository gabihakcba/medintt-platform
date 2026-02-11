import ServiceDetailLayout from '../../../../componentes/medicina-laboral/ServiceDetailLayout';

export default function EmpresasServicioIntegralSaludLaboralPage() {
  return (
    <ServiceDetailLayout category="Para Empresas" title="Servicio integral de salud laboral">
      <>
        <p className="font-semibold text-main-azul">
          Aumentá su bienestar, disminuí su ausentismo y fortalecé su fidelización con la empresa.
          Además, te asegurás de cumplir con las normas exigidas ante la ART.
        </p>

        <p>
          ¿Cómo? Mediante la elaboración de un plan integral de salud laboral, brindando diferentes
          opciones adaptadas a las necesidades de tu empresa.
        </p>

        <p className="font-semibold text-main-azul">Modalidades de nuestro Servicio Integral de Salud Laboral</p>
        <p className="font-semibold text-main-azul">Online</p>
        <p>
          A través de sesiones online mediante plataformas especializadas podrás tener a disposición la
          asesoría médico laboral que necesitás. Podrás contratar sesiones unitarias o abonos a tu
          medida.
        </p>

        <p className="font-semibold text-main-azul">¿Cómo vamos a ayudar a tu empresa?</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>
            Asesorías generales y específicas sobre casos tanto en enfermedades inculpables como de ART
            (accidentes laborales y enfermedades profesionales).
          </li>
          <li>Seguimiento de consultas. Auditoría de certificados médicos.</li>
          <li>Elaboración de informes y recomendaciones.</li>
          <li>Planificación de actividades acordes para el cuidado de la salud del empleado.</li>
          <li>¡Y mucho más!</li>
        </ul>
      </>
    </ServiceDetailLayout>
  );
}
