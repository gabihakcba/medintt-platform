"use client";

import { MedinttSidebar } from "@medintt/ui";

const items = [
  { label: "Inicio", icon: "pi pi-home", url: '/' },
  { label: "Pacientes", icon: "pi pi-users" },
  { label: "Turnos", icon: "pi pi-calendar" },
  { label: "Reportes", icon: "pi pi-chart-bar" },
  { label: "Configuración", icon: "pi pi-cog" },
  { label: "Botones", icon: "pi pi-stop", url: "botones" },
];

export default function Sidebar() {
  return (
    <MedinttSidebar
      title={<span className="text-blue-400">MEDINTT</span>}
      user={{ name: "Gabriel Hak", role: "ADMIN" }}
      version="v1.5.0"
      items={items}
      logout={{
        label: "Cerrar Sesión",
        icon: "pi pi-sign-out",
        command: () => {
          console.log("Salir");
        },
      }}
    />
  );
}
