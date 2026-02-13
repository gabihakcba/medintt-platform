"use client";

import { useIncidentesLaborales } from "@/hooks/useIncidentesLaborales";
import { MedinttGuard, MedinttTable } from "@medintt/ui";
import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/services/permissions";
import { formatDate } from "@/lib/date";
import { ProgressSpinner } from "primereact/progressspinner";
import { ColumnProps } from "primereact/column";

export default function IncidentesLaboralesPage() {
  const { user } = useAuth();
  const { data: incidentes, isLoading } = useIncidentesLaborales();

  const projectCode =
    process.env.MED_LAB_PROJECT ||
    process.env.NEXT_PUBLIC_SELF_PROJECT ||
    "MED_LAB_PROJECT";
  const requiredRoles = [
    process.env.NEXT_PUBLIC_ROLE_ADMIN!,
    process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
  ];

  const isAdmin = checkPermissions(
    user,
    process.env.NEXT_PUBLIC_SELF_PROJECT || "MED_LAB_PROJECT",
    [process.env.NEXT_PUBLIC_ROLE_ADMIN || "ADMIN"],
  );

  const columns = [
    ...(isAdmin || user?.isSuperAdmin
      ? [
          {
            field: "Prestataria.Nombre",
            header: "Prestataria",
            sortable: true,
            body: (rowData: any) => rowData.Prestataria?.Nombre || "-",
          },
        ]
      : []),
    {
      field: "Fecha",
      header: "Fecha",
      body: (rowData: any) => formatDate(rowData.Fecha),
      sortable: true,
    },
    {
      field: "Clase",
      header: "Clase",
      sortable: true,
    },
    {
      field: "Paciente",
      header: "Paciente",
      sortable: true,
    },
    {
      field: "DNI",
      header: "DNI",
      sortable: true,
    },
    {
      field: "Profesional",
      header: "Profesional",
      sortable: true,
    },
    {
      field: "Notas",
      header: "Notas",
      sortable: true,
      body: (rowData: any) => (
        <div className="whitespace-pre-wrap max-h-20 overflow-y-auto">
          {rowData.Notas}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <MedinttGuard
      data={user}
      validator={(u) => checkPermissions(u, projectCode, requiredRoles)}
    >
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Incidentes Laborales</h1>
        <MedinttTable
          columns={columns}
          data={incidentes || []}
          emptyMessage="No hay incidentes laborales registrados."
          rows={10}
          paginator
        />
      </div>
    </MedinttGuard>
  );
}
