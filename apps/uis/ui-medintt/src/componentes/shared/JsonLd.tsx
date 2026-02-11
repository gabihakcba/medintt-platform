import React from "react";

const JsonLd = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": "https://medintt.com/#organization",
    name: "Medintt",
    alternateName: [
      "Medintt Centro Médico",
      "Centro Médico de Alta Complejidad",
      "Medicina Laboral Cipolletti",
    ],
    description:
      "Centro Médico privado líder en el sur de Argentina. Especialistas en Clínica Médica, Traumatología, Cirugía y Medicina Laboral (ART). Atención a Obras Sociales y Particulares en Cipolletti y Neuquén.",
    url: "https://medintt.com",
    logo: "https://medintt.com/resources/logos/medintt_positivo_square.png",
    image: "https://medintt.com/resources/logos/medintt_positivo_square.png", // Idealmente una foto de fachada o equipo aquí

    // ESTRATEGIA LOCAL: El "Pulpo" que abarca la zona
    areaServed: [
      { "@type": "City", name: "Cipolletti" },
      { "@type": "City", name: "Neuquén" },
      { "@type": "City", name: "Fernandez Oro" },
      { "@type": "City", name: "Cinco Saltos" },
      { "@type": "AdministrativeArea", name: "Río Negro" },
      { "@type": "AdministrativeArea", name: "Neuquén" },
      { "@type": "AdministrativeArea", name: "Patagonia Argentina" },
    ],

    // DATOS DE CONTACTO REALES
    telephone: "+54-299-458-7079", // Formateado internacionalmente
    email: "administracion@medintt.com", // Si tienes uno público, agrégalo
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+54-299-458-7079",
      contactType: "reservations",
      areaServed: "AR",
      availableLanguage: "Spanish",
    },

    // DIRECCIÓN FÍSICA EXACTA
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Alem 1431",
      addressLocality: "Cipolletti",
      addressRegion: "Río Negro",
      postalCode: "8324",
      addressCountry: "AR",
    },

    // COORDENADAS EXACTAS (GPS)
    geo: {
      "@type": "GeoCoordinates",
      latitude: -38.939353963697684,
      longitude: -67.98000191384118,
    },

    // HORARIOS (Ajustar si difieren)
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "20:00",
      },
    ],

    sameAs: [
      "https://www.facebook.com/medintt",
      "https://www.instagram.com/medinttcentromedico/",
      "https://www.linkedin.com/company/medintt", // Verificar este link
    ],

    // ESPECIALIDADES (Mapeadas a Schema.org + Español)
    medicalSpecialty: [
      {
        "@type": "MedicalSpecialty",
        name: "Internal Medicine",
        alternateName: "Clínica Médica",
      },
      {
        "@type": "MedicalSpecialty",
        name: "Surgery",
        alternateName: "Clínica Quirúrgica",
      },
      {
        "@type": "MedicalSpecialty",
        name: "Orthopedic",
        alternateName: "Traumatología",
      },
      {
        "@type": "MedicalSpecialty",
        name: "Diagnostic Imaging",
        alternateName: "Diagnóstico por Imágenes",
      },
      {
        "@type": "MedicalSpecialty",
        name: "Occupational Medicine",
        alternateName: "Medicina Laboral y ART",
      },
    ],

    // SERVICIOS ADICIONALES (Clave para búsquedas de nicho)
    availableService: [
      { "@type": "MedicalProcedure", name: "Atención por Obras Sociales" },
      { "@type": "MedicalProcedure", name: "Exámenes Preocupacionales" },
      { "@type": "MedicalProcedure", name: "Control de Ausentismo" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default JsonLd;
