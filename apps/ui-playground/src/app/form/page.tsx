"use client";
import { useForm } from "react-hook-form";
import { MedinttInputText, MedinttButton } from "@medintt/ui";

type FormInputs = {
  username: string;
  email: string;
};

export default function Page() {
  const { control, handleSubmit } = useForm<FormInputs>({
    defaultValues: { username: undefined, email: "" },
  });

  const onSubmit = (data: FormInputs) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 flex flex-col gap-4 max-w-md"
    >
      <MedinttInputText
        name="username"
        control={control}
        label="Nombre de Usuario"
        placeholder="Ingresa tu usuario"
        rules={{
          required: "El usuario es obligatorio",
        }}
      />

      <MedinttInputText
        name="email"
        control={control}
        label="Correo Electrónico"
        placeholder="example@example.com.ar"
        rules={{
          required: "El email es obligatorio",
          // pattern: {
          //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          //   message: "El formato del email no es válido",
          // },
        }}
      />

      <MedinttButton label="Guardar" type="submit" />
    </form>
  );
}
