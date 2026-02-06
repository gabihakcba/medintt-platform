"use client";

import { MedinttButton, MedinttForm, MedinttToast } from "@medintt/ui";
import { ReactElement, useEffect, useRef } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { useResetPassword } from "@/hooks/useResetPassword";
import { Toast } from "primereact/toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage(): ReactElement {
  const { control, handleSubmit, watch, setError } = useForm();
  const { resetPasswordMutate, resetPasswordPending } = useResetPassword();
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Token de restablecimiento no válido o faltante",
        life: 5000,
      });
    }
  }, [token]);

  const onSubmit = (data: FieldValues) => {
    if (!token) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se encontró el token de restablecimiento",
        life: 3000,
      });
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    resetPasswordMutate(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Contraseña restablecida correctamente",
            life: 3000,
          });
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        },
        onError: () => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail:
              "No se pudo restablecer la contraseña. El token puede haber expirado.",
            life: 3000,
          });
        },
      },
    );
  };

  return (
    <Card className="h-screen flex justify-center items-center">
      <MedinttToast ref={toast} />
      <MedinttForm
        control={control}
        className="max-w-md w-full"
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        footer={
          <div className="flex flex-col w-full gap-2 mt-4">
            <MedinttButton
              label="Restablecer Contraseña"
              type="submit"
              loading={resetPasswordPending}
              disabled={!token}
            />
          </div>
        }
        sections={[
          {
            group: "Restablecer Contraseña",
            fields: [
              {
                type: "password",
                props: {
                  name: "newPassword",
                  label: "Nueva Contraseña",
                  autoComplete: "new-password",
                  placeholder: "******",
                  rules: {
                    required: {
                      value: true,
                      message: "Campo obligatorio",
                    },
                    minLength: {
                      value: 6,
                      message: "Mínimo 6 caracteres",
                    },
                  },
                },
                colSpan: 12,
              },
              {
                type: "password",
                props: {
                  name: "confirmPassword",
                  label: "Confirmar Contraseña",
                  autoComplete: "new-password",
                  placeholder: "******",
                  rules: {
                    required: {
                      value: true,
                      message: "Campo obligatorio",
                    },
                    validate: (val: string) => {
                      if (watch("newPassword") != val) {
                        return "Las contraseñas no coinciden";
                      }
                    },
                  },
                },
                colSpan: 12,
              },
            ],
          },
        ]}
      />
    </Card>
  );
}
