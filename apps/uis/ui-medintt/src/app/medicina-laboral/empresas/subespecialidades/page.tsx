import ServiceDetailLayout from '../../../../componentes/medicina-laboral/ServiceDetailLayout';

export default function EmpresasSubespecialidadesPage() {
  return (
    <ServiceDetailLayout category="Para Empresas" title="Subespecialidades">
      <>
        <p className="font-semibold text-main-azul">Nutrición</p>
        <p>
          Nuestro objetivo es concientizar a nuestros colaboradores sobre la importancia de promover y
          garantizar una alimentación saludable y equilibrada en sus empleados, para así optimizar el
          rendimiento y obtener mejores resultados en la empresa y en la vida diaria.
        </p>

        <hr className="my-6 border-main-azul/20" />

        <p className="font-semibold text-main-azul">Beneficios para las empresas</p>
        <p>
          Es bien sabido que una alimentación saludable, combinada con actividad física, son
          fundamentales para el bienestar personal y laboral de los empleados. El problema, sin embargo,
          es que la información que suele circular es en muchos casos confusa, poco clara o directamente
          errónea.
        </p>
        <p>
          Trabajando con nosotros, tus trabajadores van a recibir mensajes claros y tendrán la
          posibilidad de evacuar todas sus consultas y dudas respecto a temas de interés nutricional.
        </p>
        <p>
          Por lo tanto, invertir en nuestro servicio de nutrición no solo es un beneficio para los
          trabajadores, sino también para la propia empresa.
        </p>
      </>
    </ServiceDetailLayout>
  );
}
