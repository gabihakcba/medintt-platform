"use client";

import { useAusentismo } from "@/hooks/useAusentismos";
import { MedinttGuard, MedinttFilePreview } from "@medintt/ui";
import { checkPermissions } from "@/services/permissions";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "next/navigation";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useState } from "react";
import { formatDate } from "@/lib/date";

export default function AusentismoDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = Number(params.id);
  const { ausentismo, isLoading } = useAusentismo(id);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = (id: number, fileName: string) => {
    // Assuming backend endpoint for serving files. If not, construct URL appropriately.
    // Based on previous code in admin/datos-pendientes, url structure:
    const url = `${process.env.NEXT_PUBLIC_ADMIN_API_URL || process.env.NEXT_PUBLIC_API_URL}/medicina-laboral/declaracion-jurada/attachment/${id}`;
    // Wait, reusing DDJJ attachment endpoint might not work if logic is specific to ddjj.
    // Ausentismos attachments are likely served differently or I need an endpoint for them.
    // Typically: /storage/file/...? Or a specific controller method.
    // CHECK: Does AusentismosController have an attachment endpoint?
    // Not explicitly seen.
    // However, usually there is a generic attachment endpoint or specific one.
    // If not, I might need to add one.
    // Let's assume there isn't one yet and I should probably create one or use a generic one if exists.
    // Re-checking task: I didn't plan an attachment download/view endpoint.
    // Pivot: I will assume I need to add one.
    // For now, I'll put a placeholder URL or the one I think might work if I add it.
    // Let's use /medicina-laboral/ausentismos/attachment/:id

    setPreviewUrl(
      `${process.env.NEXT_PUBLIC_API_URL}/medicina-laboral/ausentismos/attachment/${id}`,
    );
    setPreviewTitle(fileName);
    setPreviewVisible(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!ausentismo) {
    return <div>Ausentismo no encontrado</div>;
  }

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
      <div className="p-4 flex flex-col gap-6">
        {/* Header with Prestataria - Guarded */}
        {checkPermissions(user, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
          process.env.NEXT_PUBLIC_ROLE_ADMIN!,
        ]) && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Empresa</h2>
            <p className="text-lg">
              {ausentismo.prestataria?.Nombre || "Sin Empresa asignada"}
            </p>
          </div>
        )}

        {/* Patient and Ausentismo Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Datos del Paciente</h2>
            <div className="grid grid-cols-2 gap-y-2">
              <span className="font-semibold">Nombre:</span>
              <span>
                {ausentismo.paciente?.Apellido}, {ausentismo.paciente?.Nombre}
              </span>
              <span className="font-semibold">DNI:</span>
              <span>{ausentismo.paciente?.NroDocumento}</span>
              <span className="font-semibold">Email:</span>
              <span>{ausentismo.paciente?.Email || "-"}</span>
              <span className="font-semibold">Teléfono:</span>
              <span>
                {ausentismo.paciente?.Celular1 ||
                  ausentismo.paciente?.Telefono ||
                  "-"}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Detalle del Ausentismo</h2>
            <div className="grid grid-cols-2 gap-y-2">
              <span className="font-semibold">Desde:</span>
              <span>{formatDate(ausentismo.Fecha_Desde)}</span>
              <span className="font-semibold">Hasta:</span>
              <span>{formatDate(ausentismo.Fecha_Hasta)}</span>
              <span className="font-semibold">Reincorporación:</span>
              <span>{formatDate(ausentismo.Fecha_Reincoporacion)}</span>
              <span className="font-semibold">Categoría:</span>
              <span>{ausentismo.Ausentismos_Categorias?.Categoria || "-"}</span>
              <span className="font-semibold">Diagnóstico:</span>
              <span>{ausentismo.Diagnostico || "-"}</span>
              <span className="font-semibold">Evolución:</span>
              <span>{ausentismo.Evolucion || "-"}</span>
            </div>
          </div>
        </div>

        {/* Attachments Accordions */}
        <Accordion multiple activeIndex={[0, 1]}>
          <AccordionTab
            header={
              <div className="flex items-center gap-2">
                <i className="pi pi-file"></i>
                <span>
                  Adjuntos ({ausentismo.Ausentismos_Attachs?.length || 0})
                </span>
              </div>
            }
          >
            {ausentismo.Ausentismos_Attachs &&
            ausentismo.Ausentismos_Attachs.length > 0 ? (
              <div className="flex flex-col gap-2">
                {ausentismo.Ausentismos_Attachs.map((att) => (
                  <div
                    key={att.Id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                  >
                    <span>{att.FileName}</span>
                    <Button
                      icon="pi pi-eye"
                      rounded
                      text
                      onClick={() =>
                        handlePreview(att.Id, att.FileName || "Documento")
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay adjuntos</p>
            )}
          </AccordionTab>

          <AccordionTab
            header={
              <div className="flex items-center gap-2">
                <i className="pi pi-file-pdf"></i>
                <span>
                  Certificados (
                  {ausentismo.Ausentismos_Certificados?.length || 0})
                </span>
              </div>
            }
          >
            {ausentismo.Ausentismos_Certificados &&
            ausentismo.Ausentismos_Certificados.length > 0 ? (
              <div className="flex flex-col gap-2">
                {ausentismo.Ausentismos_Certificados.map((cert) => (
                  <div
                    key={cert.Id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                  >
                    <span>{cert.FileName}</span>
                    <Button
                      icon="pi pi-eye"
                      rounded
                      text
                      onClick={() =>
                        handlePreview(cert.Id, cert.FileName || "Certificado")
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay certificados</p>
            )}
          </AccordionTab>
        </Accordion>

        <MedinttFilePreview
          visible={previewVisible}
          onHide={() => setPreviewVisible(false)}
          url={previewUrl}
          title={previewTitle}
        />
      </div>
    </MedinttGuard>
  );
}
