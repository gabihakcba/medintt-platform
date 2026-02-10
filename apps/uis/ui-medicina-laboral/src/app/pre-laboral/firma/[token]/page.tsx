/* eslint-disable @next/next/no-img-element */
"use client";

import { use, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { SignaturePad } from "../components/SignaturePad";
import { StepSignatureDNIVerification } from "../components/StepSignatureDNIVerification";
import { getData, saveFirma, VerifyFirmaResponse } from "@/queries/firma";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function SignaturePage({ params }: PageProps) {
  const { token } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const toast = useRef<Toast>(null);

  // State
  const [step, setStep] = useState<"dni" | "form" | "preview" | "success">(
    "dni",
  );
  const [proof, setProof] = useState<string | null>(null);
  const [savedSignature, setSavedSignature] = useState<string | null>(null);
  const [tempSignature, setTempSignature] = useState<string | null>(null);

  // Queries & Mutations
  const getDataMutation = useMutation({
    mutationFn: (proofArg: string) => getData(proofArg),
    onSuccess: (data) => {
      setSavedSignature(data.firma);
      setStep("success");
    },
    onError: () => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo recuperar la firma guardada.",
      });
    },
  });

  const saveSignatureMutation = useMutation({
    mutationFn: () => saveFirma(proof!, tempSignature!),
    onSuccess: () => {
      // Fetch the saved signature to display confirmation (and verify it was saved)
      getDataMutation.mutate(proof!);
      toast.current?.show({
        severity: "success",
        summary: "Firma Guardada",
        detail: "La firma se ha capturado exitosamente.",
        life: 3000,
      });
    },
    onError: () => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar la firma. Intente nuevamente.",
      });
    },
  });

  // Handlers
  const handleVerified = (data: VerifyFirmaResponse) => {
    setProof(data.proof);
    if (data.firma) {
      // Already has signature, fetch it and show success
      getDataMutation.mutate(data.proof);
    } else {
      setStep("form");
    }
  };

  const handleCaptureSignature = (signatureData: string) => {
    setTempSignature(signatureData);
    setStep("preview");
  };

  const handleConfirmSave = () => {
    if (proof && tempSignature) {
      saveSignatureMutation.mutate();
    }
  };

  const handleRetry = () => {
    setTempSignature(null);
    setStep("form");
  };

  const handleReturn = () => {
    if (returnUrl) {
      router.push(returnUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Toast ref={toast} />

      {step === "dni" && (
        <div className="w-full max-w-md">
          <StepSignatureDNIVerification
            token={token}
            onVerified={handleVerified}
          />
        </div>
      )}

      {step === "form" && (
        <div className="w-full max-w-lg">
          <Card className="shadow-lg">
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Firma Digital
                </h1>
                <p className="text-gray-600">
                  Por favor, firme en el recuadro a continuación utilizando su
                  dedo o mouse.
                </p>
              </div>
              <SignaturePad onSave={handleCaptureSignature} />
            </div>
          </Card>
        </div>
      )}

      {step === "preview" && tempSignature && (
        <div className="w-full max-w-lg">
          <Card className="shadow-lg">
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-xl font-bold text-gray-800">Vista Previa</h2>
              <div className="p-4 border rounded-lg bg-white w-full flex justify-center">
                <img
                  src={tempSignature}
                  alt="Vista previa de firma"
                  className="max-h-40"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  label="Guardar firma"
                  icon="pi pi-check"
                  className="w-full p-button-success"
                  style={{ backgroundColor: "#22c55e", borderColor: "#22c55e" }}
                  onClick={handleConfirmSave}
                  loading={saveSignatureMutation.isPending}
                />
                <Button
                  label="Intentar de nuevo"
                  icon="pi pi-refresh"
                  className="w-full p-button-outlined p-button-secondary"
                  onClick={handleRetry}
                  disabled={saveSignatureMutation.isPending}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {step === "success" && savedSignature && (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-8 text-center flex flex-col items-center gap-4">
          <i className="pi pi-check-circle text-6xl text-green-500 mb-2"></i>
          <h1 className="text-2xl font-bold text-gray-800">¡Muchas gracias!</h1>
          <p className="text-gray-600 text-lg">Ya completaste tu firma.</p>
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <img
              src={
                savedSignature.startsWith("data:image")
                  ? savedSignature
                  : `data:image/png;base64,${savedSignature}`
              }
              alt="Firma guardada"
              className="max-h-40"
            />
          </div>

          {returnUrl && (
            <Button
              label="Volver a la Declaración"
              icon="pi pi-arrow-left"
              className="w-full mt-4"
              onClick={handleReturn}
            />
          )}
        </div>
      )}
    </div>
  );
}
