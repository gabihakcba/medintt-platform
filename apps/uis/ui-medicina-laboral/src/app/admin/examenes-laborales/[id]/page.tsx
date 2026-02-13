"use client";

import { useExamenesLaborales } from "@/hooks/useExamenesLaborales";
import { MedinttGuard, MedinttFilePreview } from "@medintt/ui";
import { checkPermissions } from "@/services/permissions";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "next/navigation";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useState, useRef } from "react";
import { formatDate } from "@/lib/date";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";

export default function ExamenesLaboralesPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = Number(params.id);
  const { data: examenes, isLoading } = useExamenesLaborales(id);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewExtension, setPreviewExtension] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  const handlePreview = (
    attachmentId: number,
    fileName: string,
    extension: string | null,
  ) => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://apiadmin.medintt.local:4020/api/v1";
    const fullUrl = `${apiUrl}/medicina-laboral/examenes-laborales/attachment/${attachmentId}`;

    setPreviewUrl(fullUrl);
    setPreviewTitle(fileName);
    setPreviewExtension(extension);
    setPreviewVisible(true);
  };

  const handleHidePreview = () => {
    setPreviewVisible(false);
    setPreviewUrl(null);
    setPreviewExtension(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  // Check permissions
  const projectCode =
    process.env.MED_LAB_PROJECT ||
    process.env.NEXT_PUBLIC_SELF_PROJECT ||
    "MED_LAB_PROJECT";
  const requiredRoles = [
    process.env.NEXT_PUBLIC_ROLE_ADMIN!,
    process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
  ];

  /* 
     We can use checkPermissions helper, but we also manually check in render logic below.
     Here just setting up for MedinttGuard if needed, or manual check.
  */
  const hasPermission =
    user && checkPermissions(user, projectCode, requiredRoles);

  if (!hasPermission) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>No tienes permisos para acceder a esta página.</h1>
      </div>
    );
  }

  const paciente = examenes?.[0]?.Paciente;

  return (
    <MedinttGuard
      data={user}
      validator={(u) => checkPermissions(u, projectCode, requiredRoles)}
    >
      <div className="card">
        <Toast ref={toast} />

        {/* Header with Patient Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Exámenes Laborales</h1>
            {paciente && (
              <div className="text-color-secondary">
                <span className="font-semibold">
                  {paciente.Apellido}, {paciente.Nombre}
                </span>
                <span className="mx-2">|</span>
                <span>DNI: {paciente.NroDocumento}</span>
              </div>
            )}
            {!paciente && !isLoading && examenes && examenes.length > 0 && (
              // Fallback if patient data is inside the first exam but flattened by service
              <div className="text-color-secondary">
                <span className="font-semibold">
                  {examenes[0].Paciente?.Apellido},{" "}
                  {examenes[0].Paciente?.Nombre}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Exams List */}
        {!examenes || examenes.length === 0 ? (
          <div className="p-4 text-center text-color-secondary">
            No hay exámenes laborales registrados para este empleado.
          </div>
        ) : (
          <Accordion activeIndex={0}>
            {examenes.map((examen) => (
              <AccordionTab
                key={examen.Id}
                header={
                  <div className="flex justify-between items-center w-full pr-4">
                    <span className="font-semibold">
                      {examen.Examenes_Laborales?.Examenes?.Codigo ||
                        "Sin Código"}
                    </span>
                    <div className="flex gap-2">
                      <Tag
                        value={examen.Status || "Sin Estado"}
                        severity={getStatusSeverity(examen.Status)}
                      />
                      {examen.Fecha_Alta && (
                        <span className="text-sm text-color-secondary">
                          {formatDate(examen.Fecha_Alta)}
                        </span>
                      )}
                    </div>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-color-secondary"
                        >
                          Práctica
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-color-secondary"
                        >
                          Fecha
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-color-secondary"
                        >
                          Estado
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-color-secondary"
                        >
                          Autorización
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-color-secondary"
                        >
                          Adjuntos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {examen.Practicas &&
                        examen.Practicas.map((practica) => (
                          <tr
                            key={practica.Id}
                            className="border-b border-surface-200 dark:border-surface-700"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {practica.Descripcion || "Sin Descripción"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-color-secondary">
                              {formatDate(practica.Fecha_Practica)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Tag
                                value={practica.Status || "Sin Estado"}
                                severity={getStatusSeverity(practica.Status)}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-color-secondary">
                              {practica.Autorizacion || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {practica.Practicas_Attachs &&
                              practica.Practicas_Attachs.length > 0 ? (
                                <div className="flex gap-2">
                                  {practica.Practicas_Attachs.map((attach) => (
                                    <div key={attach.Id} className="flex gap-1">
                                      <Button
                                        icon="pi pi-eye"
                                        rounded
                                        text
                                        tooltip={`Ver ${attach.FileName}`}
                                        tooltipOptions={{ position: "top" }}
                                        onClick={() =>
                                          handlePreview(
                                            attach.Id,
                                            attach.FileName || "Archivo",
                                            attach.Extension || null,
                                          )
                                        }
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-color-secondary text-xs italic">
                                  Sin adjuntos
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      {(!examen.Practicas || examen.Practicas.length === 0) && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-4 text-center text-color-secondary text-sm italic"
                          >
                            No hay prácticas registradas para este examen.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </AccordionTab>
            ))}
          </Accordion>
        )}

        <MedinttFilePreview
          visible={previewVisible}
          onHide={handleHidePreview}
          url={previewUrl}
          title={previewTitle}
          extension={previewExtension}
        />
      </div>
    </MedinttGuard>
  );
}

function getStatusSeverity(status: string | null) {
  if (!status) return "info";
  switch (status.toLowerCase()) {
    case "terminado":
    case "finalizado":
    case "aprobado":
      return "success";
    case "pendiente":
    case "en proceso":
      return "warning";
    case "rechazado":
    case "cancelado":
      return "danger";
    default:
      return "info";
  }
}
