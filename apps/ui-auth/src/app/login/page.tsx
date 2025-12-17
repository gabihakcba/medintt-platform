"use client";

import { MedinttButton, MedinttForm } from "@medintt/ui";
import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { Card } from "primereact/card";

const sendParentMessage = (ok: boolean, data?: { user: object }) => {
  if (window.parent) {
    let message = "MEDINTT_AUTH_SUCCESS";
    if (!ok) {
      message = "MEDINTT_AUTH_CANCELED";
    }
    window.parent.postMessage({ type: message, user: data?.user }, "*");
  }
};

export default function LoginPage(): ReactElement {
  const { control, handleSubmit } = useForm();
  return (
    <Card className="h-screen flex justify-center items-center">
      <MedinttForm
        control={control}
        className="max-w-280"
        onSubmit={() => console.log("Hola mundo")}
        handleSubmit={handleSubmit}
        footer={
          <>
            <MedinttButton
              label="Cancelar"
              type="button"
              onClick={() => console.log("Cancelar")}
              severity="secondary"
              text
            />
            <MedinttButton label="Iniciar Sesión" type="submit" icon="pi pi-sign-in"/>
          </>
        }
        sections={[
          {
            group: "Iniciar Sesión",
            fields: [
              {
                type: "text",
                props: {
                  name: "email",
                  label: "Email",
                  autoComplete: "off",
                  placeholder: "ejemplo@gmail.com",
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
