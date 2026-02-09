"use client";

import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/services/permissions";
import { MedinttGuard, MedinttTable } from "@medintt/ui";
import { usePacientes } from "@/hooks/usePacientes";

export default function EmpleadosPage() {
  const { user } = useAuth();
  const { pacientes, isLoading } = usePacientes();

  const columns = [
    { field: "Apellido", header: "Apellido" },
    { field: "Nombre", header: "Nombre" },
    { field: "NroDocumento", header: "Nro Doc" },
    { field: "Email", header: "Email" },
    { field: "Cargo", header: "Cargo" },
    { field: "Puesto", header: "Puesto" },
  ];

  return (
    <MedinttGuard
      data={user}
      validator={(u) =>
        checkPermissions(u, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
          process.env.NEXT_PUBLIC_ROLE_ADMIN!,
          process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
        ])
      }
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Empleados</h1>

        <MedinttTable
          data={pacientes || []}
          columns={columns}
          loading={isLoading}
          globalFilterFields={["Apellido", "Nombre", "NroDocumento", "Email"]}
        />
      </div>
    </MedinttGuard>
  );
}
