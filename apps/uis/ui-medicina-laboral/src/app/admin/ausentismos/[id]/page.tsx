"use client";

import { useAusentismo } from "@/hooks/useAusentismos";
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

export default function AusentismoDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = Number(params.id);
  const { ausentismo, isLoading } = useAusentismo(id);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const toast = useRef<Toast>(null);

  const handlePreview = (
    id: number,
    fileName: string,
    type: "attachment" | "certificate",
  ) => {
    const endpoint = type === "certificate" ? "certificate" : "attachment";
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://apiadmin.medintt.local:4020/api/v1";
    const fullUrl = `${apiUrl}/medicina-laboral/ausentismos/${endpoint}/${id}`;

    setPreviewUrl(fullUrl);
    setPreviewTitle(fileName);
    setPreviewVisible(true);
  };

  const handleHidePreview = () => {
    setPreviewVisible(false);
    setPreviewUrl(null);
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
      <>
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
                <span>
                  {ausentismo.Ausentismos_Categorias?.Categoria || "-"}
                </span>
                <span className="font-semibold">Diagnóstico:</span>
                <span>{ausentismo.Diagnostico || "-"}</span>
                <span className="font-semibold">Evolución:</span>
                <div className="max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {ausentismo.Evolucion || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Attachments Accordions */}
          <Accordion multiple activeIndex={[0, 1, 2, 3, 4]}>
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
                          handlePreview(
                            att.Id,
                            att.FileName || "Documento",
                            "attachment",
                          )
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
                          handlePreview(
                            cert.Id,
                            cert.FileName || "Certificado",
                            "certificate",
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay certificados</p>
              )}
            </AccordionTab>

            <AccordionTab
              header={
                <div className="flex items-center gap-2">
                  <i className="pi pi-book"></i>
                  <span>
                    Bitácora ({ausentismo.Ausentismos_Bitacora?.length || 0})
                  </span>
                </div>
              }
            >
              <div className="max-h-[40vh] overflow-y-auto pr-2">
                {ausentismo.Ausentismos_Bitacora &&
                ausentismo.Ausentismos_Bitacora.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {ausentismo.Ausentismos_Bitacora.map((item) => (
                      <div
                        key={item.Id}
                        className="p-3 bg-gray-50 rounded border border-gray-200"
                      >
                        <div className="text-sm text-gray-500 mb-1">
                          {formatDate(item.Fecha)}
                        </div>
                        <div className="whitespace-pre-wrap">
                          {item.Observaciones || "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay registros en bitácora</p>
                )}
              </div>
            </AccordionTab>

            <AccordionTab
              header={
                <div className="flex items-center gap-2">
                  <i className="pi pi-check-square"></i>
                  <span>
                    Controles ({ausentismo.Ausentismos_Controles?.length || 0})
                  </span>
                </div>
              }
            >
              <div className="max-h-[40vh] overflow-y-auto pr-2">
                {ausentismo.Ausentismos_Controles &&
                ausentismo.Ausentismos_Controles.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {ausentismo.Ausentismos_Controles.map((control) => (
                      <div
                        key={control.Id}
                        className="p-3 bg-gray-50 rounded border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="col-span-1 md:col-span-2 text-sm text-gray-500 border-b pb-2 mb-2">
                          Fecha Control: {formatDate(control.Fecha_Control)}
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">
                            Instrucciones:
                          </span>
                          <div className="whitespace-pre-wrap text-sm">
                            {control.Instrucciones || "-"}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">
                            Evolución:
                          </span>
                          <div className="whitespace-pre-wrap text-sm">
                            {control.Evolucion || "-"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay controles registrados</p>
                )}
              </div>
            </AccordionTab>

            <AccordionTab
              header={
                <div className="flex items-center gap-2">
                  <i className="pi pi-info-circle"></i>
                  <span>
                    Informes ({ausentismo.Ausentismos_Informes?.length || 0})
                  </span>
                </div>
              }
            >
              <div className="max-h-[40vh] overflow-y-auto pr-2">
                {ausentismo.Ausentismos_Informes &&
                ausentismo.Ausentismos_Informes.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {ausentismo.Ausentismos_Informes.map((item) => (
                      <div
                        key={item.Id}
                        className="p-3 bg-gray-50 rounded border border-gray-200"
                      >
                        <div className="text-sm text-gray-500 mb-1">
                          {formatDate(item.Fecha)}
                        </div>
                        <div className="whitespace-pre-wrap">
                          {item.Informe || "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay informes registrados</p>
                )}
              </div>
            </AccordionTab>
          </Accordion>
        </div>

        <MedinttFilePreview
          visible={previewVisible}
          onHide={handleHidePreview}
          url={previewUrl}
          title={previewTitle}
        />
      </>
    </MedinttGuard>
  );
}
