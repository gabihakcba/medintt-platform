import { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { MedinttButton } from "@medintt/ui";
import { SignaturePad } from "../../../pre-laboral/firma/components/SignaturePad";
import { useUpdatePacienteSignature } from "../../../../hooks/usePacientes";

interface SignatureModalProps {
  visible: boolean;
  onHide: () => void;
  pacienteId: number;
  pacienteNombreCompleto: string;
  hasExistingSignature: boolean;
}

export function SignatureModal({
  visible,
  onHide,
  pacienteId,
  pacienteNombreCompleto,
  hasExistingSignature,
}: SignatureModalProps) {
  const toast = useRef<Toast>(null);

  const signatureUrl = hasExistingSignature
    ? `${process.env.NEXT_PUBLIC_API_URL}/medicina-laboral/pacientes/${pacienteId}/firma?t=${new Date().getTime()}`
    : null;

  // States
  const [viewMode, setViewMode] = useState<"preview" | "edit">(
    hasExistingSignature ? "preview" : "edit",
  );
  const [tempSignature, setTempSignature] = useState<string | null>(null);
  const [deleteExisting, setDeleteExisting] = useState<boolean>(false);

  // Hook
  const updateSignatureMutation = useUpdatePacienteSignature();

  // Reset modal when closing or opening
  const handleHide = () => {
    setViewMode(hasExistingSignature ? "preview" : "edit");
    setTempSignature(null);
    setDeleteExisting(false);
    onHide();
  };

  const handleCapture = (signatureData: string) => {
    setTempSignature(signatureData);
  };

  const handleSave = () => {
    if (viewMode === "edit" && !tempSignature && !deleteExisting) {
      toast.current?.show({
        severity: "warn",
        summary: "Firma requerida",
        detail: "Debe dibujar una firma antes de guardar.",
      });
      return;
    }

    const payloadPayload = {
      firma: deleteExisting ? "" : tempSignature || "",
    };

    updateSignatureMutation.mutate(
      { id: pacienteId, payload: payloadPayload },
      {
        onSuccess: () => {
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "La firma se ha actualizado correctamente.",
          });
          setTimeout(() => {
            handleHide();
          }, 1000);
        },
        onError: () => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo guardar la firma.",
          });
        },
      },
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={handleHide}
      header={`Firma de ${pacienteNombreCompleto}`}
      className="w-full max-w-2xl mx-4"
    >
      <Toast ref={toast} />

      <div className="flex flex-col gap-6 py-4">
        {viewMode === "preview" && signatureUrl && !tempSignature && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-gray-700">Firma Actual</h3>
            <div className="p-4 border rounded bg-gray-50 flex justify-center w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signatureUrl}
                alt="Firma registrada"
                className="max-h-40"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <MedinttButton
                label="Limpiar y re-dibujar"
                icon="pi pi-refresh"
                severity="secondary"
                outlined
                onClick={() => {
                  setViewMode("edit");
                  setDeleteExisting(false);
                }}
              />
              <div className="flex items-center gap-2 px-3">
                <Checkbox
                  inputId="delete-signature"
                  checked={deleteExisting}
                  onChange={(e) => {
                    setDeleteExisting(e.checked!);
                    setViewMode("edit");
                  }}
                />
                <label
                  htmlFor="delete-signature"
                  className="text-red-500 cursor-pointer"
                >
                  Eliminar firma permanente
                </label>
              </div>
            </div>
          </div>
        )}

        {viewMode === "edit" && !tempSignature && !deleteExisting && (
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-center text-gray-600">
              Dibuje la firma a continuación:
            </p>
            <div className="w-full">
              <SignaturePad onSave={handleCapture} />
            </div>
          </div>
        )}

        {/* View mode Edit with temp signature */}
        {((viewMode === "edit" && tempSignature) ||
          (viewMode === "edit" && deleteExisting)) && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="font-semibold text-gray-700">Vista Previa</h3>
            <div className="p-4 border border-dashed rounded bg-white flex justify-center w-full">
              {deleteExisting ? (
                <span className="text-gray-400 italic py-10">
                  La firma será eliminada permanentemente.
                </span>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={tempSignature!}
                  alt="Vista previa"
                  className="max-h-40"
                />
              )}
            </div>
            {!deleteExisting && (
              <MedinttButton
                label="Volver a dibujar"
                icon="pi pi-undo"
                severity="secondary"
                outlined
                onClick={() => setTempSignature(null)}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t pt-4 mt-4">
        <MedinttButton
          label="Cancelar"
          severity="secondary"
          outlined
          onClick={handleHide}
          disabled={updateSignatureMutation.isPending}
        />
        <MedinttButton
          label="Guardar"
          icon="pi pi-save"
          onClick={handleSave}
          loading={updateSignatureMutation.isPending}
          disabled={
            viewMode === "preview" ||
            (viewMode === "edit" && !tempSignature && !deleteExisting)
          }
        />
      </div>
    </Dialog>
  );
}
