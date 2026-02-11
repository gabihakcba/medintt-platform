import ServiceDetailLayout from '../../../../componentes/medicina-laboral/ServiceDetailLayout';

export default function EmpresasCapacitacionesPage() {
  return (
    <ServiceDetailLayout category="Para Empresas" title="Capacitaciones">
      <>
        <p>
          Estas charlas / talleres pueden darse de manera online o presencial y tienen como objetivo
          impulsar hábitos saludables a través de la promoción de la salud.
        </p>
        <p>
          Con el fin de cumplimentar los apartados de la Resolución 905/15, podemos brindar las
          siguientes charlas (solicitar cotización aparte):
        </p>

        <p className="font-semibold text-main-azul">Modalidad Online/Presencial</p>
        <ul className="ml-6 list-disc space-y-1">
          <li>Dengue: información clara y actualizada para proteger a los trabajadores de tu empresa</li>
          <li>Prevención de adicciones en el ámbito laboral (tabaco, alcohol y drogas)</li>
          <li>Promoción de la actividad física (sedentarismo)</li>
          <li>Prevención de enfermedades cardiovasculares</li>
          <li>Promoción de alimentación saludable</li>
          <li>Programa de ergonomía</li>
          <li>RCP + Primeros auxilios</li>
          <li>Promoción y prevención de la salud mental en el área laboral</li>
          <li>Manejo de la voz, cuanto sabemos de ella y cómo cuidarla</li>
          <li>Toxicología: conceptos generales</li>
          <li>COVID - Información general y conceptos claves</li>
        </ul>
      </>
    </ServiceDetailLayout>
  );
}
