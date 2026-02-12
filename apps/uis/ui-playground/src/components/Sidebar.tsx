"use client";

import { MedinttSidebar } from "@medintt/ui";

const items = [
  { label: "Inicio", icon: "pi pi-home", url: "/" },
  { label: "Botones", icon: "pi pi-stop", url: "/botones" },
  { label: "Form", icon: "pi pi-list", url: "/form" },
  { label: "Tabla", icon: "pi pi-table", url: "/tabla" },
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
          console.warn("Salir");
        },
      }}
    />
  );
}
