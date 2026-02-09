import ServiceDetailLayout from '../../../../componentes/medicina-laboral/ServiceDetailLayout';

export default function EmpresasHigieneSeguridadPage() {
  return (
    <ServiceDetailLayout category="Para Empresas" title="Higiene y Seguridad">
      <>
        <p>
          Brindamos asesoramiento especializado e implementamos planes de acción que abarcan todos los
          aspectos previstos por las normativas de H&amp;S vigentes. Ofrecemos soluciones integrales a
          medida para cada organización. Nos enfocamos en la prevención y en el desarrollo de acciones
          junto al Servicio de Salud Ocupacional.
        </p>

        <p className="font-semibold text-main-azul">
          ¿Por qué contratar el servicio de seguridad e higiene en el trabajo?
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Para proteger a sus colaboradores de accidentes laborales.</li>
          <li>
            Para evitar multas. Al estar cubiertas con el Servicio de S&amp;H, las empresas cumplen con las
            Normativas Legales vigentes frente a las Autoridades de aplicación, ART, Municipalidad, etc.
          </li>
          <li>
            Porque brinda Seguridad para toda la Organización posibilitando mejorar los estándares de
            Calidad, Productividad y Trabajo Sin Riesgos.
          </li>
        </ul>
      </>
    </ServiceDetailLayout>
  );
}
