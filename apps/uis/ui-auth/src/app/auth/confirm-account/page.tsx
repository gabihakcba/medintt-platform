"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { MedinttButton, MedinttToast } from "@medintt/ui";
import { useConfirmAccount } from "@/hooks/useConfirmAccount";
import { Suspense, useRef, useState } from "react";
import { Toast } from "primereact/toast";

function ConfirmAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { confirm, isConfirming } = useConfirmAccount();
  const toast = useRef<Toast>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!token) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Token no encontrado en la URL",
      });
      return;
    }

    try {
      await confirm(token);
      setIsSuccess(true);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Cuenta confirmada exitosamente",
      });
      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || "Error al confirmar la cuenta",
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <MedinttToast ref={toast} />
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <i
            className="pi pi-check-circle text-green-500 mb-4"
            style={{ fontSize: "3rem" }}
          ></i>
          <h1 className="text-2xl font-bold mb-2">¡Cuenta Confirmada!</h1>
          <p className="text-gray-600 mb-6">
            Tu correo electrónico ha sido verificado correctamente. Serás
            redirigido al inicio de sesión en unos segundos.
          </p>
          <MedinttButton
            label="Ir al Login"
            icon="pi pi-sign-in"
            onClick={() => router.push("/login")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <MedinttToast ref={toast} />
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <i
          className="pi pi-envelope text-blue-500 mb-4"
          style={{ fontSize: "3rem" }}
        ></i>
        <h1 className="text-2xl font-bold mb-2">Confirmar Cuenta</h1>
        <p className="text-gray-600 mb-6">
          Haz clic en el botón de abajo para confirmar tu dirección de correo
          electrónico.
        </p>

        {!token ? (
          <span className="text-red-500 block mb-4 font-medium">
            Error: Token inválido o faltante.
          </span>
        ) : (
          <MedinttButton
            label={isConfirming ? "Confirmando..." : "Confirmar mi cuenta"}
            icon={isConfirming ? "pi pi-spin pi-spinner" : "pi pi-check"}
            onClick={handleConfirm}
            loading={isConfirming}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}

export default function ConfirmAccountPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ConfirmAccountContent />
    </Suspense>
  );
}
