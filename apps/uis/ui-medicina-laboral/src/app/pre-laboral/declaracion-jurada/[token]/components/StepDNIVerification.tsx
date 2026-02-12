"use client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { verifyUser, VerifyResponseDto } from "@/queries/declaracion-jurada";
import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";

interface StepDNIVerificationProps {
  token: string;
  onVerified: (data: VerifyResponseDto) => void;
  verifyFn: (
    token: string,
    dni: string,
    fechaNacimiento?: string,
  ) => Promise<VerifyResponseDto>;
}

export const StepDNIVerification = ({
  token,
  onVerified,
  verifyFn,
}: StepDNIVerificationProps) => {
  const [dni, setDni] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (dniToVerify: string) => verifyFn(token, dniToVerify),
    onSuccess: (data) => {
      onVerified(data);
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        setErrorMsg(
          "La declaración jurada ya está completada. Comuníquese si necesita modificarla.",
        );
      } else if (error.response?.status === 401) {
        setErrorMsg(
          "Link vencido, por favor comunicarse para obtener uno nuevo",
        );
      } else {
        setErrorMsg("Error al validar los datos");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni) return;

    const cleanedDni = dni.trim().replace(/[.,]/g, "");
    setErrorMsg(null);
    mutation.mutate(cleanedDni);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Verificación de Identidad
          </h2>
          <p className="text-gray-600 mt-2">
            Por favor ingresá tu DNI para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="dni" className="font-medium text-gray-700">
              DNI
            </label>
            <InputText
              id="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingresá tu número de documento"
              className="p-3 w-full"
              keyfilter="int"
            />
            <small className="text-gray-500">
              Por favor, no ingresar puntos ni comas.
            </small>
          </div>

          {(errorMsg || mutation.isError) && (
            <Message
              severity="error"
              text={errorMsg || "Ocurrió un error"}
              className="w-full"
            />
          )}

          <Button
            label="Verificar"
            icon="pi pi-arrow-right"
            iconPos="right"
            loading={mutation.isPending}
            type="submit"
            className="w-full mt-2"
            disabled={!dni || mutation.isPending}
          />
        </form>
      </Card>
    </div>
  );
};
