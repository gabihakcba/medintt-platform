"use client";

import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/services/permissions";
import { MedinttGuard, MedinttTable } from "@medintt/ui";
import { usePacientes } from "@/hooks/usePacientes";

export default function EmpleadosPage() {
  const { user } = useAuth();
  const { pacientes, isLoading } = usePacientes();

  const patientsWithCompanies =
    pacientes?.map((p: any) => ({
      ...p,
      prestatariasString:
        p.prestatarias?.map((prep: any) => prep.Nombre).join(", ") || "",
    })) || [];

  const columns = [
    { field: "Apellido", header: "Apellido" },
    { field: "Nombre", header: "Nombre" },
    { field: "NroDocumento", header: "Nro Doc" },
    {
      field: "prestatariasString",
      header: "Empresa",
      hidden: !checkPermissions(user, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
        process.env.NEXT_PUBLIC_ROLE_ADMIN!,
      ]),
    },
    { field: "Email", header: "Email" },
    { field: "Cargo", header: "Cargo" },
    { field: "Puesto", header: "Puesto" },
    {
      field: "examenes",
      header: "Examenes Laborales",
      hidden: !checkPermissions(user, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
        process.env.NEXT_PUBLIC_ROLE_ADMIN!,
        process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
      ]),
      body: (rowData: any) => {
        const hasExams = (rowData.examenesCount || 0) > 0;
        return (
          <a
            href={
              hasExams ? `/admin/examenes-laborales/${rowData.Id}` : undefined
            }
            className={`text-blue-600 hover:text-blue-800 ${
              !hasExams
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
            title={
              hasExams
                ? "Ver Examenes Laborales"
                : "No tiene examenes laborales"
            }
            aria-disabled={!hasExams}
          >
            <i className="pi pi-eye text-xl"></i>
          </a>
        );
      },
    },
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
          data={patientsWithCompanies}
          columns={columns}
          loading={isLoading}
          enableGlobalFilter={true}
          globalFilterFields={[
            "Apellido",
            "Nombre",
            "NroDocumento",
            "Email",
            "prestatariasString",
          ]}
        />
      </div>
    </MedinttGuard>
  );
}
