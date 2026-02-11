import ServiceDetailLayout from '../../../../componentes/medicina-laboral/ServiceDetailLayout';

export default function EmpresasAusentismoPage() {
  return (
    <ServiceDetailLayout category="Para Empresas" title="Ausentismo">
      <>
        <p className="font-semibold text-main-azul">Objetivo</p>
        <p>
          La gestión de ausentismo es la mejor manera de agilizar el seguimiento del ausentismo de los
          empleados, pudiendo realizarlo de manera presencial como virtual. Esta última evita la
          necesidad de desplazamiento tanto del paciente como del médico.
        </p>

        <p className="font-semibold text-main-azul">¿Qué incluyen nuestros servicios?</p>
        <p>
          Visitas a domicilio: Es importante destacar que no reemplazará al servicio de ausentismo
          tradicional, sino que lo complementará. Quienes nos elijan para gestionar el ausentismo de sus
          empleados continuarán teniendo la posibilidad de enviar médicos a domicilio.
        </p>
        <p>
          Atención en nuestros consultorios: En caso de que se requieran análisis extras, el paciente
          podrá atenderse sin necesidad de ser derivado, haciendo uso de todas las prestaciones de la
          clínica.
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Fonoaudiología</li>
          <li>Ergometría</li>
          <li>Ecografía</li>
          <li>Resonancia magnética</li>
          <li>Espirometría</li>
          <li>Oftalmológico</li>
          <li>Psicodiagnóstico</li>
          <li>Test de drogas</li>
          <li>Otros</li>
        </ul>

        <p>
          Seguimiento virtual de ausentismo: Se trata de un servicio médico a distancia que permite
          verificar y monitorear, mediante una consulta virtual, la enfermedad que impide la
          concurrencia del empleado a su lugar de trabajo. Esto supone un ahorro sustancial tanto de
          tiempo como de recursos.
        </p>
      </>
    </ServiceDetailLayout>
  );
}
