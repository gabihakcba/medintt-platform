"use client";

import { useRef, useState, use, useEffect } from "react";
import { Toast } from "primereact/toast";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button } from "primereact/button";
import {
  updateData,
  GetDeclaracionResponse,
  VerifyResponseDto,
  getData,
  DeclaracionJurada,
} from "@/queries/declaracion-jurada";
import { PacienteData, updatePaciente } from "@/queries/medintt4";
import { StepDNIVerification } from "./components/StepDNIVerification";
import Formulario from "../components/Formulario";
import DatosPersonalesForm from "../components/DatosPersonalesForm";

type Step =
  | "dni"
  | "personal_data"
  | "form"
  | "error"
  | "success"
  | "signature_required";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function DeclaracionJuradaPage({ params }: PageProps) {
  const { token } = use(params);
  const toast = useRef<Toast>(null);
  const [step, setStep] = useState<Step>("dni");
  const [errorMsg] = useState("");
  const [proof, setProof] = useState<string | null>(null);
  const [data, setData] = useState<GetDeclaracionResponse | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  // Auto-check for signature when window regains focus
  useEffect(() => {
    const checkSignatureOnFocus = async () => {
      if (step === "signature_required" && proof) {
        try {
          const newData = await getData(proof);
          if (newData.declaracion.Status === "TERMINADO") {
            setStep("success");
            return;
          }
          if (newData.paciente.firma) {
            setData(newData);
            setStep("form");
            toast.current?.show({
              severity: "success",
              summary: "Firma Verificada",
              detail: "Hemos detectado tu firma correctamente.",
              life: 3000,
            });
          }
        } catch (error) {
          console.error("Error auto-checking signature", error);
        }
      }
    };

    window.addEventListener("focus", checkSignatureOnFocus);
    return () => window.removeEventListener("focus", checkSignatureOnFocus);
  }, [step, proof]);

  const handleManualCheck = async () => {
    if (proof) {
      try {
        const newData = await getData(proof);
        if (newData.declaracion.Status === "TERMINADO") {
          setStep("success");
          return;
        }
        if (newData.paciente.firma) {
          setData(newData);
          setStep("form");
        } else {
          toast.current?.show({
            severity: "warn",
            summary: "Firma Faltante",
            detail: "Aún no detectamos tu firma. Por favor complétala.",
            life: 3000,
          });
        }
      } catch (error) {
        console.error("Error manual checking signature", error);
      }
    }
  };

  // 1. DNI Verification & Auth
  const handleDNIVerified = (response: VerifyResponseDto) => {
    setProof(response.proof);
    setData(response.ddjj);

    // Check for "TERMINADO" status first
    if (response.ddjj.declaracion.Status === "TERMINADO") {
      setStep("success");
      return;
    }

    // New step: Personal Data
    setStep("personal_data");
  };

  // 2. Update Personal Data
  const personalDataMutation = useMutation({
    mutationFn: (formData: PacienteData) => updatePaciente(proof!, formData),
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Datos actualizados",
        detail: "Tus datos personales se han guardado correctamente.",
        life: 3000,
      });

      // After updating personal data, proceed to signature check or form
      if (data && !data.paciente.firma && data.paciente.firmaUrl) {
        setSignatureUrl(data.paciente.firmaUrl);
        setStep("signature_required");
      } else {
        setStep("form");
      }
    },
    onError: (error: AxiosError) => {
      console.error("Error updating personal data", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al actualizar tus datos personales. Inténtalo de nuevo.",
        life: 3000,
      });
    },
  });

  const handlePersonalDataSubmit = (formData: PacienteData) => {
    personalDataMutation.mutate(formData);
  };

  // 3. Update DDJJ Data (Mutation)
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
        detail: "Declaración jurada guardada correctamente",
        life: 3000,
      });
    },
    onError: (error: AxiosError) => {
      interface ApiErrorResponse {
        message?: string;
        firmaUrl?: string;
        paciente?: any; // To verify if patient data was missing (backend returns 409)
      }
      const errorData = error.response?.data as ApiErrorResponse;

      if (errorData?.message === "Firma no cargada" && errorData?.firmaUrl) {
        setSignatureUrl(errorData.firmaUrl);
        setStep("signature_required");
        toast.current?.show({
          severity: "warn",
          summary: "Firma Requerida",
          detail: "Debes completar tu firma antes de finalizar.",
          life: 5000,
        });
        return;
      }

      if (errorData?.message === "Faltan datos personales del paciente") {
        // Should not happen if we did step personal_data correctly, but as failsafe:
        setStep("personal_data");
        toast.current?.show({
          severity: "warn",
          summary: "Datos Incompletos",
          detail: "Faltan datos personales obligatorios.",
          life: 5000,
        });
        return;
      }

      if (error.response?.status === 409) {
        toast.current?.show({
          severity: "warn",
          summary: "Atención",
          detail:
            "La declaración jurada ya está completada. Comuníquese si necesita modificarla.",
          life: 5000,
        });
      } else if (error.response?.status === 401) {
        toast.current?.show({
          severity: "warn",
          summary: "Link Vencido",
          detail: "Link vencido, por favor comunicarse para obtener uno nuevo",
          life: 5000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al guardar declaración",
          life: 3000,
        });
      }
    },
  });

  const handleFormSubmit = (formData: DeclaracionJurada) => {
    // Excluir campos que maneja el backend
    const {
      Id: _Id,
      Id_empresa: _Id_empresa,
      Id_Paciente: _Id_Paciente,
      Id_Practica: _Id_Practica,
      Fecha: _Fecha,
      Status: _Status,
      Genero: _Genero,
      ...dataToSend
    } = formData;

    mutation.mutate(
      dataToSend as Omit<
        DeclaracionJurada,
        "Id" | "Id_empresa" | "Id_Paciente" | "Id_Practica"
      >,
    );
  };

  if (step === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md border-l-4 border-red-500">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-700">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (step === "signature_required") {
    const returnUrl = encodeURIComponent(window.location.href);
    // Append returnUrl to signatureUrl if it exists
    const finalSignatureUrl = signatureUrl
      ? `${signatureUrl}${signatureUrl.includes("?") ? "&" : "?"}returnUrl=${returnUrl}`
      : "#";

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-l-4 border-yellow-500 p-8 text-center flex flex-col items-center gap-4">
          <i className="pi pi-exclamation-circle text-6xl text-yellow-500 mb-2"></i>
          <h1 className="text-2xl font-bold text-gray-800">Firma Requerida</h1>
          <p className="text-gray-600 text-lg">
            Primero debes completar tu firma para poder continuar.
          </p>
          <div className="flex flex-col gap-2 w-full">
            <a
              href={finalSignatureUrl}
              // target="_self" is default, removed target="_blank"
              className="w-full"
            >
              <Button
                label="Completar Firma Aquí"
                icon="pi pi-pencil"
                className="p-button-warning w-full"
              />
            </a>
            <Button
              label="Verificar Nuevamente"
              icon="pi pi-refresh"
              className="p-button-outlined p-button-secondary w-full"
              onClick={handleManualCheck}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-8 text-center flex flex-col items-center gap-4">
          <i className="pi pi-check-circle text-6xl text-green-500 mb-2"></i>
          <h1 className="text-2xl font-bold text-gray-800">¡Muchas gracias!</h1>
          <p className="text-gray-600 text-lg">
            Ya completaste tu declaración jurada.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />

      {step === "dni" && (
        <div className="pt-20">
          <StepDNIVerification token={token} onVerified={handleDNIVerified} />
        </div>
      )}

      {step === "personal_data" && data && (
        <DatosPersonalesForm
          initialData={data.paciente}
          onSubmit={handlePersonalDataSubmit}
          isLoading={personalDataMutation.isPending}
        />
      )}

      {step === "form" && data && data.empresa && (
        <Formulario
          initialData={data.declaracion}
          paciente={data.paciente}
          empresa={data.empresa}
          onSubmit={handleFormSubmit}
          isLoading={mutation.isPending}
        />
      )}
    </div>
  );
}
