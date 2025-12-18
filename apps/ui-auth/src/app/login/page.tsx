"use client";

import { MedinttButton, MedinttForm } from "@medintt/ui";
import { ReactElement } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Card } from "primereact/card";
import { useLoginHook } from "@/hooks/login";
import { LoginResponseDto, TYPE_LOGIN } from "@medintt/types-auth";
import { AxiosError } from "axios";

export const sendParentMessage = (
  type: TYPE_LOGIN,
  data?: {
    user?: LoginResponseDto;
    error?: AxiosError;
  }
) => {
  if (window.parent) {
    const message: {
      type: TYPE_LOGIN;
      error?: AxiosError;
      user?: LoginResponseDto;
    } = { type };
    if (data?.error) message.error = data?.error;
    console.log(message);
    window.parent.postMessage(message, "*");
  }
};

export default function LoginPage(): ReactElement {
  const { control, handleSubmit } = useForm();
  const { loginHook, loginPending } = useLoginHook();

  return (
    <Card className="h-screen flex justify-center items-center">
      <MedinttForm
        control={control}
        className="max-w-280"
        onSubmit={(data: FieldValues) => loginHook(data)}
        handleSubmit={handleSubmit}
        footer={
          <div className="flex shrink justify-center items-center flex-col-reverse sm:flex-row w-full">
            {/* <MedinttButton
              label="Perdir acceso"
              type="button"
              onClick={() => console.log("Mail enviado")}
              severity="info"
              link
              text
            /> */}
            <MedinttButton
              label="Olvide mi contraseña"
              type="button"
              onClick={() => sendParentMessage("FORGOT")}
              severity="secondary"
              text
              link
            />
            <MedinttButton
              label="Iniciar Sesión"
              type="submit"
              icon="pi pi-sign-in"
              loading={loginPending}
            />
          </div>
        }
        sections={[
          {
            group: "Iniciar Sesión",
            fields: [
              {
                type: "text",
                props: {
                  name: "email",
                  label: "Email o Usuario",
                  autoComplete: "off",
                  placeholder: "ejemplo@gmail.com | usuario",
                  rules: {
                    required: { value: true, message: "Campo obligatorio" },
                  },
                },
                colSpan: 12,
              },
              {
                type: "password",
                props: {
                  name: "password",
                  label: "Contraseña",
                  autoComplete: "off",
                  placeholder: "******",
                  rules: {
                    required: { value: true, message: "Campo obligatorio" },
                    minLength: { value: 6, message: "6 caracteres" },
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
