"use client";

import { useRef, useState, use } from "react";
import { Toast } from "primereact/toast";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  updateData,
  GetDeclaracionResponse,
  VerifyResponseDto,
  DeclaracionJurada,
  verifyPersonalData,
} from "@/queries/declaracion-jurada";
import { PacienteData, updatePaciente } from "@/queries/medintt4";
import { StepDNIVerification } from "../../declaracion-jurada/[token]/components/StepDNIVerification";
import DatosPersonalesForm from "../../declaracion-jurada/components/DatosPersonalesForm";
import { Button } from "primereact/button";

type Step = "dni" | "personal_data" | "success" | "error";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function DatosPersonalesPage({ params }: PageProps) {
  const { token } = use(params);
  const toast = useRef<Toast>(null);
  const [step, setStep] = useState<Step>("dni");
  const [errorMsg] = useState("");
  const [proof, setProof] = useState<string | null>(null);
  const [data, setData] = useState<GetDeclaracionResponse | null>(null);

  // 1. DNI Verification
  const handleDNIVerified = (response: VerifyResponseDto) => {
    setProof(response.proof);
    setData(response.ddjj);
    setStep("personal_data");
  };

  // 2. Submit Data
  // We use updateData (declaracion-jurada) because it regenerates the PDF and handles the status.
  // Although updatePaciente exists, updateData is the main flow for DDJJ.
  // The user requirement says "completar los datos... y lo uses tambien en ... datos personales".
  // If we use updatePaciente only, the PDF in Practicas_Attachs won't be updated.
  // We should use updateData to ensure consistency.
  // BUT updateData requires DeclaracionJurada object, not just PacienteData.
  // So we need to merge the new patient data with the existing DDJJ data.

  const mutation = useMutation({
    mutationFn: (
      formData: Omit<
        DeclaracionJurada,
        "Id" | "Id_empresa" | "Id_Paciente" | "Id_Practica"
      >,
    ) => updateData(proof!, formData),
    onSuccess: () => {
      setStep("success");
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Datos guardados correctamente",
        life: 3000,
      });
    },
    onError: (error: AxiosError) => {
      console.error("Error saving data", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar los datos.",
        life: 3000,
      });
    },
  });

  const handlePersonalDataSubmit = (pacienteData: PacienteData) => {
    if (!data) return;

    // We need to construct the full DeclaracionJurada object to send to updateData.
    // We take existing answers from data.declaracion and merge new patient data?
    // wait, updateData takes DeclaracionJurada.
    // And backend `updateByProof` uses `dto` (UpdateDeclaracionDto).
    // `UpdateDeclaracionDto` is likely just the answers.
    // Where does Patient Data go?
    // In `updateByProof`:
    // `const updateData = { ...dto, ... }`
    // It updates `Declaraciones_Juradas`.
    // Wait, `Declaraciones_Juradas` schema has `Pacientes` relation.
    // Does `updateDeclaracionDto` include patient fields?
    // I need to check `UpdateDeclaracionDto`.

    // If `updateByProof` ONLY updates `Declaraciones_Juradas`, then how does `Pacientes` get updated?
    // Review `declaracion-jurada.service.ts`:
    // It does NOT seem to update `Pacientes` explicitly in the transaction!
    // Line 381: `updatedDj = await tx.declaraciones_Juradas.update({ where: ..., data: updateData, include: { Pacientes: true } })`
    // `updateData` comes from `dto`.
    // If `dto` has patient fields, and `Declaraciones_Juradas` has them (it doesn't, they are in Pacientes table), then this update logic is FLAGGED.
    // `Declaraciones_Juradas` table does NOT have Apellido, Nombre. `Pacientes` table does.
    // `updateByProof` in Step 1621:
    // It validates patient data (lines 322-336).
    // It updates `Declaraciones_Juradas` (lines 381-385).
    // IT DOES NOT UPDATE PACIENTES TABLE!
    // This implies `updateByProof` assumes patient data was updated SEPARATELY (e.g. by `updatePaciente` call before?).
    // OR `Declaraciones_Juradas` schema has nested write?
    // `data: updateData` -> `updateData` is spread `dto`.
    // If `dto` has `Pacientes: { update: ... }` then yes.
    // But `dto` comes from body.

    // Let's check `declaracion-jurada/[token]/page.tsx` again.
    // It has `personalDataMutation` calling `updatePaciente(proof!, formData)`.
    // AND `mutation` calling `updateData(proof!, formData)`.
    // So there are TWO backend calls!
    // 1. `handlePersonalDataSubmit` calls `personalDataMutation` -> `updatePaciente`.
    // 2. `handleFormSubmit` calls `mutation` -> `updateData`.

    // So my page should use `updatePaciente`.
    // AND then maybe `updateData` to regenerate PDF?
    // If I only call `updatePaciente`, the PDF is NOT regenerated.
    // The user wants "completar los datos". If I just update DB, PDF is stale.
    // I should call `updatePaciente` THEN `updateData`.
    // But `updateData` requires answers.
    // We can send existing answers.

    // Better approach:
    // 1. Call `updatePaciente` with new data.
    // 2. Call `updateData` with existing answers (from `data.declaracion`) to trigger PDF regen and status update.

    updatePaciente(proof!, pacienteData)
      .then(() => {
        // Success updating patient. Now regenerate PDF.
        // We need to strip ID etc from data.declaracion.
        const {
          Id,
          Id_empresa,
          Id_Paciente,
          Id_Practica,
          Fecha,
          Status,
          Genero,
          ...answers
        } = data.declaracion;

        mutation.mutate(answers as any);
      })
      .catch((err) => {
        console.error("Error updating patient", err);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al actualizar datos personales",
          life: 3000,
        });
      });
  };

  if (step === "error") {
    return <div>Error: {errorMsg}</div>;
  }

  if (step === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-8 text-center flex flex-col items-center gap-4">
          <i className="pi pi-check-circle text-6xl text-green-500 mb-2"></i>
          <h1 className="text-2xl font-bold text-gray-800">
            ¡Datos Actualizados!
          </h1>
          <p className="text-gray-600 text-lg">
            Sus datos personales han sido actualizados correctamente.
          </p>
          <a
            href="/pre-laboral/declaracion-jurada/success"
            className="w-full text-center"
          >
            <Button
              label="Volver / Salir"
              className="p-button-outlined w-full"
            />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      {step === "dni" && (
        <div className="pt-20">
          <StepDNIVerification
            token={token}
            onVerified={handleDNIVerified}
            verifyFn={verifyPersonalData}
          />
        </div>
      )}

      {step === "personal_data" && data && (
        <DatosPersonalesForm
          initialData={data.paciente}
          onSubmit={handlePersonalDataSubmit}
          isLoading={mutation.isPending}
        />
      )}
    </div>
  );
}
