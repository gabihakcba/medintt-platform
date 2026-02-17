"use client";

import { useState } from "react";
import Image from "next/image";
import ServiceCard from "../../componentes/servicios-web/ServiceCard";
import ConversionBanner from "../../componentes/servicios-web/ConversionBanner";
import ServiceDetailsSidebar, {
  ServiceDetails,
} from "../../componentes/servicios-web/ServiceDetailsSidebar";
import DemoRequestModal from "../../componentes/servicios-web/DemoRequestModal";

const medicinaLaboralDetails: ServiceDetails = {
  title: "Gestión Integral de Medicina Laboral",
  description:
    "Olvídese de los correos electrónicos perdidos y los archivos en papel. Nuestra plataforma centraliza la salud de su nómina en un solo lugar, permitiendo a los representantes de RR.HH. y Gerencia tomar decisiones basadas en datos reales.",
  features: [
    {
      title: "Dashboard de Prelaborales",
      description:
        "Visualice el progreso de cada candidato desde que se asigna el turno hasta que el apto médico está disponible.",
    },
    {
      title: "Visor de Documentación Legal",
      description:
        "Acceda a resultados de exámenes periódicos, libretas sanitarias y evaluaciones psicotécnicas con validez para auditorías.",
    },
    {
      title: "Historial Clínico Laboral",
      description:
        "Consulte el historial de sus empleados de manera segura, facilitando el seguimiento de ausentismos y enfermedades profesionales.",
    },
    {
      title: "Alertas de Vencimientos",
      description:
        "Reciba notificaciones automáticas cuando un examen periódico esté por vencer.",
    },
  ],
};

const cloudMedinttDetails: ServiceDetails = {
  title: "Cloud Medintt: Almacenamiento Médico Inteligente",
  description:
    "Diseñado específicamente para el sector salud, Cloud Medintt rompe la barrera entre el centro médico y la empresa. Una infraestructura robusta pensada para manejar grandes volúmenes de información con seguridad bancaria.",
  features: [
    {
      title: "Interconexión Directa",
      description:
        "Los documentos generados en el Centro Médico Medintt se sincronizan automáticamente en su panel, sin esperas.",
    },
    {
      title: "Estructura Personalizada",
      description:
        "Organizamos su nube bajo un esquema de archivos acordado previamente para que nunca pierda un documento.",
    },
    {
      title: "Velocidad de Fibra Óptica",
      description:
        "Suba y descargue archivos masivos (Rayos X de alta resolución, tomografías, carpetas completas) a una velocidad de 1Gb.",
    },
    {
      title: "Colaboración Segura",
      description:
        "Comparta carpetas específicas con el centro médico o mantenga archivos privados para uso interno de la empresa.",
    },
  ],
};

export default function ServiciosWebPage() {
  const [selectedService, setSelectedService] = useState<ServiceDetails | null>(
    null,
  );
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleDemoClick = () => {
    setIsDemoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl space-y-20">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 md:text-5xl tracking-tight">
            Nuestras Soluciones Digitales
          </h1>
          <p className="text-xl text-slate-600">
            Tecnología de vanguardia aplicada a la gestión de salud corporativa.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {/* Medicina Laboral Card */}
          <ServiceCard
            title="Medicina Laboral"
            teaser="Transforme la burocracia médica en agilidad corporativa."
            bullets={[
              "Visibilidad Total: Acceda a estudios médicos y evaluaciones al instante.",
              "Archivo Digital Centralizado: Documentación oficial con validez legal.",
              "Toma de Decisiones: Monitoreo en tiempo real de prelaborales.",
            ]}
            ctaText="Ver Detalles"
            onCtaClick={() => setSelectedService(medicinaLaboralDetails)}
            icon={
              <Image
                src="/apps/medicina-laboral/icono_no_bg.png"
                alt="Medicina Laboral"
                width={48}
                height={48}
                className="object-contain"
              />
            }
          />

          {/* Cloud Medintt Card */}
          <ServiceCard
            title="Cloud Medintt"
            teaser="Seguridad de grado médico, velocidad de última generación."
            bullets={[
              "Sincronización Médica: Documentación automática desde nuestro centro.",
              "Potencia Extrema: Infraestructura de 1Gb para archivos pesados.",
              "Privacidad Selectiva: Control absoluto sobre la información.",
              "Escalabilidad: Almacenamiento que crece con su empresa.",
            ]}
            ctaText="Ver Detalles"
            className="bg-gradient-to-br from-white to-blue-50 border-blue-100"
            onCtaClick={() => setSelectedService(cloudMedinttDetails)}
            icon={
              <Image
                src="/apps/cloud/icono_no_bg.png"
                alt="Cloud Medintt"
                width={48}
                height={48}
                className="object-contain"
              />
            }
          />
        </div>

        {/* Conversion Banner */}
        <ConversionBanner onCtaClick={handleDemoClick} />
      </div>

      <ServiceDetailsSidebar
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
        onDemoClick={handleDemoClick}
      />

      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}
