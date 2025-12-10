"use client";

import { useForm } from "react-hook-form";
import { MedinttForm, MedinttButton } from "@medintt/ui";

export default function Page() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      edad: null,
      email: "",
      direccion: "",
      roles: [],
    },
  });

  const onSubmit = (data) => console.log(data);

  return (
    <div className="min-w-screen flex justify-center items-center">
      <MedinttForm
        className="max-w-200 px-4"
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        sections={[
          {
            group: "Información Personal",
            fields: [
              {
                type: "text",
                colSpan: 4,
                props: {
                  name: "nombre",
                  label: "Nombre",
                  rules: { required: "Obligatorio" },
                },
              },
              {
                type: "text",
                colSpan: 4,
                props: {
                  name: "apellido",
                  label: "Apellido",
                  rules: { required: "Obligatorio" },
                },
              },
              {
                type: "number",
                colSpan: 4,
                props: { name: "edad", label: "Edad" },
              },
            ],
          },
          {
            group: "Cuenta y Contacto",
            fields: [
              {
                type: "text",
                colSpan: 12,
                props: { name: "email", label: "Email" },
              },
              {
                type: "multiselect",
                colSpan: 12,
                props: {
                  name: "roles",
                  label: "Roles",
                  options: [
                    { label: "Admin", value: 1 },
                    { label: "User", value: 2 },
                  ],
                },
              },
            ],
          },
        ]}
        footer={
          <>
            <MedinttButton label="Cancelar" severity="secondary" text />
            <MedinttButton label="Guardar Usuario" type="submit" />
          </>
        }
      />
    </div>
  );
}
