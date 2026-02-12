"use client";

import { MedinttTable, MedinttButton } from "@medintt/ui";
import { formatDate } from "@medintt/utils";

const users = [
  {
    id: 1,
    user: { name: "Juan", lastname: "Perez" },
    role: "Admin",
    fechaIngreso: new Date("2024-01-15T00:00:00.000Z"),
    active: true,
  },
  {
    id: 2,
    user: { name: "Maria", lastname: "Gomez" },
    role: "User",
    fechaIngreso: new Date("2024-03-10T00:00:00.000Z"),
    active: false,
  },
];

export default function TablePage() {
  return (
    <div className="p-4">
      <MedinttTable
        title="Gestión de Usuarios"
        data={users}
        loading={false}
        columns={[
          {
            header: "ID",
            field: "id",
            sortable: true,
            style: { width: "50px" },
          },
          { header: "Nombre", field: "user.name", sortable: true },
          {
            header: "Nombre Completo",
            body: (row) => (
              <span className="font-bold">
                {row.user.name} {row.user.lastname}
              </span>
            ),
            sortable: false,
          },
          { header: "Rol", field: "role", sortable: true },
          {
            header: "Ingreso",
            field: "fechaIngreso",
            body: (row) => formatDate(row.fechaIngreso),
          },
        ]}
        enableGlobalFilter
        globalFilterFields={["user.name", "user.lastname", "role"]}
        dateFilter={{
          field: "fechaIngreso",
          mode: "range",
          placeholder: "Rango de Ingreso",
        }}
        actions={(row) => (
          <div className="flex gap-2 justify-start">
            <MedinttButton
              icon="pi pi-pencil"
              rounded
              text
              severity="warning"
              onClick={() => console.warn("Editar", row.id)}
            />
            <MedinttButton
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              onClick={() => console.warn("Borrar", row.id)}
            />
          </div>
        )}
        paginator
        rows={5}
      />
    </div>
  );
}
