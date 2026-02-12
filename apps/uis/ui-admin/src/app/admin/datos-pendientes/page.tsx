"use client";

import { usePendingData } from "@/hooks/usePendingData";
import { useAuth } from "@/hooks/useAuth";
import { MedinttGuard, MedinttTable, MedinttFilePreview } from "@medintt/ui";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useState, useRef } from "react";
import { checkPermissions } from "@/services/permissions";
import { Column } from "primereact/column";

export default function PendingDataPage() {
  const { user } = useAuth();
  const { pendingData, isLoading, sendEmail, isSending } = usePendingData();
  const [selectedPatients, setSelectedPatients] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const toastRef = useRef<Toast>(null);

  const handleSendEmails = async () => {
    if (selectedPatients.length === 0) return;

    try {
      const patientsToSend = selectedPatients.map((p) => ({
        Id: p.Id,
        Email: p.Pacientes.Email,
        Nombre: p.Pacientes.Nombre,
        Apellido: p.Pacientes.Apellido,
      }));

      await sendEmail(patientsToSend);

      toastRef.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Correos enviados correctamente",
        life: 3000,
      });
      setSelectedPatients([]);
      // Refetch/Invalidate is handled in hook or we can add refetch here if hook exposes it
    } catch (error) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Fallo al enviar correos",
        life: 3000,
      });
    }
  };

  const openPdf = (id: number) => {
    const url = `${process.env.NEXT_PUBLIC_ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL}/medicina-laboral/declaracion-jurada/attachment/${id}`;
    setPdfUrl(url);
    setVisible(true);
  };

  const attachmentBodyTemplate = (rowData: any) => {
    const practicas = rowData.Practicas;
    if (
      !practicas ||
      !practicas.Practicas_Attachs ||
      practicas.Practicas_Attachs.length === 0
    ) {
      return null;
    }

    return (
      <div className="flex flex-col gap-1">
        {practicas.Practicas_Attachs.map((att: any) => (
          <Button
            key={att.Id}
            label={att.FileName || "Ver PDF"}
            link
            className="p-0 text-left text-sm"
            onClick={() => openPdf(att.Id)}
          />
        ))}
      </div>
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
    { field: "Pacientes.Apellido", header: "Apellido", sortable: true },
    { field: "Pacientes.Nombre", header: "Nombre", sortable: true },
    { field: "Pacientes.NroDocumento", header: "DNI", sortable: true },
    { field: "Pacientes.Email", header: "Email", sortable: true },
    { field: "Pacientes.Celular1", header: "Teléfono", sortable: true },
    {
      field: "Attachments",
      header: "Adjuntos",
      body: attachmentBodyTemplate,
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
      <div className="card p-4">
        <Toast ref={toastRef} />

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Datos personales faltantes</h1>
          <Button
            label="Enviar Links"
            icon="pi pi-envelope"
            onClick={handleSendEmails}
            disabled={selectedPatients.length === 0 || isSending}
            loading={isSending}
          />
        </div>

        <MedinttTable
          columns={columns}
          data={pendingData || []}
          loading={isLoading}
          selection={selectedPatients}
          onSelectionChange={(e: any) => setSelectedPatients(e.value)}
          dataKey="Id"
          paginator
          rows={10}
        />

        <MedinttFilePreview
          visible={visible}
          onHide={() => setVisible(false)}
          url={pdfUrl}
          title="Vista Previa de Documento"
        />
      </div>
    </MedinttGuard>
  );
}
