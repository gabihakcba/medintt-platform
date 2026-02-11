"use client";

import { usePendingDDJJ } from "@/hooks/usePendingDDJJ";
import { useAuth } from "@/hooks/useAuth";
import { MedinttGuard, MedinttTable } from "@medintt/ui";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useState } from "react";
import { checkPermissions } from "@/services/permissions";

export default function PendingDDJJPage() {
  const { user } = useAuth();
  const { query, sendEmailsMutation, toastRef } = usePendingDDJJ();
  const [selectedDDJJs, setSelectedDDJJs] = useState<any[]>([]);

  const handleSendEmails = async () => {
    if (selectedDDJJs.length === 0) return;

    // Extract IDs
    const ids = selectedDDJJs.map((dj) => dj.Id);

    // Call mutation
    sendEmailsMutation.mutate(ids, {
      onSuccess: () => {
        setSelectedDDJJs([]); // Clear selection on success
        query.refetch(); // Refresh data
      },
    });
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        icon="pi pi-send"
        rounded
        text
        severity="info"
        aria-label="Enviar"
        onClick={() => {
          // Single send logic could go here or re-use bulk logic
          const ids = [rowData.Id];
          sendEmailsMutation.mutate(ids, {
            onSuccess: () => {
              query.refetch();
            },
          });
        }}
        tooltip="Enviar Link"
      />
    );
  };

  const statusBodyTemplate = (rowData: any) => {
    // You can customize status display here
    return (
      <span className={`status-badge status-${rowData.Status?.toLowerCase()}`}>
        {rowData.Status}
      </span>
    );
  };

  const columns = [
    {
      selectionMode: "multiple" as const,
      headerStyle: { width: "3rem" },
      field: "selection",
      header: "",
      sortable: false,
    },
    { field: "Id", header: "ID", sortable: true },
    { field: "Pacientes.Nombre", header: "Nombre", sortable: true },
    { field: "Pacientes.Apellido", header: "Apellido", sortable: true },
    { field: "Pacientes.NroDocumento", header: "DNI", sortable: true },
    { field: "Pacientes.Email", header: "Email", sortable: true },
    { field: "Prestatarias.Nombre", header: "Empresa", sortable: true },
    { field: "Fecha", header: "Fecha", sortable: true },
    {
      field: "Status",
      header: "Estado",
      body: statusBodyTemplate,
      sortable: true,
    },
  ];

  return (
    <MedinttGuard
      data={user}
      validator={(u) =>
        checkPermissions(
          u,
          process.env.NEXT_PUBLIC_SELF_PROJECT!,
          process.env.NEXT_PUBLIC_ROLE_ADMIN!,
        )
      }
    >
      <div className="card">
        <Toast ref={toastRef} />

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Declaraciones Pendientes</h1>
          <Button
            label="Enviar Links Seleccionados"
            icon="pi pi-envelope"
            onClick={handleSendEmails}
            disabled={
              selectedDDJJs.length === 0 || sendEmailsMutation.isPending
            }
            loading={sendEmailsMutation.isPending}
          />
        </div>

        <MedinttTable
          columns={columns}
          data={query.data || []}
          loading={query.isLoading}
          selection={selectedDDJJs}
          onSelectionChange={(e: any) => setSelectedDDJJs(e.value)}
          dataKey="Id"
          actions={actionBodyTemplate}
          actionsHeader="Acciones"
          paginator
          rows={10}
        />
      </div>
    </MedinttGuard>
  );
}
