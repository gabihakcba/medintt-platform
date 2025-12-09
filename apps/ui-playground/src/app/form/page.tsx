"use client";
import { useForm } from "react-hook-form";
import {
  MedinttInputText,
  MedinttButton,
  MedinttPassword,
  MedinttCheckbox,
  MedinttDropdown,
  MedinttInputNumber,
  MedinttCalendar,
} from "@medintt/ui";
import { parseLocalDateToISO } from "@medintt/utils";

type FormInputs = {
  username: string;
  email: string;
  password: string;
  seleccionar: boolean;
  peso: number;
  fecha: string;
  opciones: Array<{ label: string; value: number }>;
  testVirtual: Array<{
    id: number,
    name: string,
    code: string,
  }>;
};

export default function Page() {
  const { control, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      username: undefined,
      email: "",
      password: undefined,
      seleccionar: undefined,
      peso: undefined,
      fecha: parseLocalDateToISO("12-01-25") ?? undefined,
    },
  });

  const onSubmit = (data: FormInputs) => console.log(data);

  const milItems = Array.from({ length: 10000 }).map((_, i) => ({
    id: i,
    name: `Item ${i}`,
    code: `COD-${i}`,
  }));

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
        rules={
          {
            // required: "El usuario es obligatorio",
          }
        }
      />

      <MedinttInputText
        name="email"
        control={control}
        label="Correo Electrónico"
        placeholder="example@example.com.ar"
        rules={
          {
            // required: "El email es obligatorio",
            // pattern: {
            //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            //   message: "El formato del email no es válido",
            // },
          }
        }
      />

      <MedinttPassword
        name="password"
        control={control}
        label="Contraseña"
        rules={
          {
            // required: "Contraseña obligatoria",
            // minLength: { value: 6, message: "Mínimo 6 caracteres" },
          }
        }
        placeholder="Contraseña"
      />

      <MedinttCheckbox
        name="seleccionar"
        control={control}
        label="Selecciona"
        // rules={{ required: { value: true, message: "Campo boligatorio" } }}
      />

      <MedinttDropdown
        name="opciones"
        control={control}
        label="Opciones"
        options={[
          {
            name: "Gabi",
            lastName: "Hak",
            id: 1,
            Permisos: { nombre: "dev", rango: 7 },
          },
          {
            name: "Ivan",
            lastName: "Hakson",
            id: 2,
            Permisos: { nombre: "admin", rango: 9 },
          },
        ]}
        optionLabel={(row) => `${row.name} ${row.lastName}`}
        optionValue="id"
        filter
        filterBy="id,lastName,name,Permisos.nombre,Permisos.rango"
      />

      <MedinttDropdown
        control={control}
        name="testVirtual"
        label="Prueba de Rendimiento (10k items)"
        options={milItems}
        optionLabel="name"
        optionValue="id"
        filter
      />

      <MedinttInputNumber
        control={control}
        name="peso"
        label="Peso (kg)"
        placeholder="0.000"
        mode="decimal"
        // rules={{ required: "El peso es obligatorio" }}
      />

      <MedinttCalendar
        name="fecha"
        control={control}
        label="Fecha"
        viewMode="date"
      />

      <MedinttButton label="Guardar" type="submit" />
    </form>
  );
}
