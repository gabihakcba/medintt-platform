"use client";

import {
  MedinttForm,
  MedinttButton,
  FormSection,
  FieldDefinition,
} from "@medintt/ui";
import { ReactElement, useMemo, useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { PacienteResponse } from "@/queries/declaracion-jurada";
import {
  PacienteData,
  getProvincias,
  getLocalidades,
  Provincia,
  Localidad,
} from "@/queries/medintt4";
import { Divider } from "primereact/divider";

interface DatosPersonalesFormProps {
  initialData: PacienteResponse;
  onSubmit: (data: PacienteData) => void;
  isLoading?: boolean;
}

export default function DatosPersonalesForm({
  initialData,
  onSubmit,
  isLoading = false,
}: DatosPersonalesFormProps): ReactElement {
  // Queries
  const provinciasQuery = useQuery({
    queryKey: ["provincias"],
    queryFn: getProvincias,
    staleTime: Infinity,
  });

  const localitiesQuery = useQuery({
    queryKey: ["localidades"],
    queryFn: getLocalidades,
    staleTime: Infinity,
  });

  // Prepare default values
  const defaultValues = useMemo(() => {
    // Find province ID from locality ID if possible
    let provId = undefined;
    if (initialData.Id_Localidad && localitiesQuery.data) {
      const loc = localitiesQuery.data.find(
        (l) => l.Id === initialData.Id_Localidad,
      );
      if (loc) {
        provId = loc.Id_Provincia;
      }
    }

    return {
      Apellido: initialData.Apellido,
      Nombre: initialData.Nombre,
      NroDocumento: initialData.NroDocumento,
      FechaNacimiento: initialData.FechaNacimiento
        ? new Date(initialData.FechaNacimiento)
        : null,
      Direccion: initialData.Direccion,
      Barrio: initialData.Barrio || "",
      Id_Provincia: provId,
      Id_Localidad: initialData.Id_Localidad,
      Telefono: initialData.Telefono || initialData.Celular1 || "", // Default empty string
      // Note: PacienteResponse doesn't have Celular1/Email exposed in interface above but let's check
      // Wait, PacienteResponse in declaracion-jurada.ts has Direccion but does it have Email?
      // I need to check PacienteResponse definition.
      // Assuming it has Email. If not, I'll need to update interface or assume it comes in payload.
      // But query returns what backend sends. Backend sends filtered object?
      // Check declaracion-jurada.service.ts getByProof response.
      // It returns: Nombre, Apellido, NroDoc, FechNac, Dir, Gen, Barrio, Id_Localidad.
      // NO EMAIL! NO TELEFONO in GET response!
      // Wait, check `declaracion-jurada.service.ts` getByProof return value.
      // Line 292: Nombre, Apellido, NroDocumento, FechaNacimiento, Direccion, Genero, Barrio, Id_Localidad.
      // Missing: Email, Telefono, Celular1.
      // User requirement: "Los datos que ya vengan de la respuesta del back se autocomplentan con posibilidad de edicion".
      // If backend doesn't return Email/Phone, I can't prefill them.
      // I should UPDATE `getByProof` in `declaracion-jurada.service.ts` to include Email and Phone/Celular.
      // But I am supposed to implement "DatosPersonalesForm".
      // I will assume I need to fetch them or update backend.
      // Given user instructions, I should probably update backend to return these fields.
      // Let's add Email, Celular1, Telefono to `declaracion-jurada.service.ts` return first.

      Email: initialData.Email || "",
      Nacionalidad: initialData.Nacionalidad || "",
      CUIL: initialData.CUIL || "",
      Genero: initialData.Genero || "",
    };
  }, [initialData, localitiesQuery.data]);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues,
  });

  // If fetching localities reveals the province, update form value once
  useEffect(() => {
    if (
      defaultValues.Id_Localidad &&
      !watch("Id_Provincia") &&
      localitiesQuery.data
    ) {
      const loc = localitiesQuery.data.find(
        (l) => l.Id === defaultValues.Id_Localidad,
      );
      if (loc) {
        setValue("Id_Provincia", loc.Id_Provincia);
      }
    }
  }, [localitiesQuery.data, defaultValues.Id_Localidad, setValue, watch]);

  const selectedProvincia = watch("Id_Provincia");

  const sections: FormSection<FieldValues>[] = useMemo(() => {
    const provinciasOptions =
      provinciasQuery.data?.map((p) => ({
        label: p.Provincia,
        value: p.Id,
      })) || [];

    const filteredLocalidades =
      localitiesQuery.data
        ?.filter((l) => l.Id_Provincia === selectedProvincia)
        .map((l) => ({
          label: l.Localidad,
          value: l.Id,
        })) || [];

    return [
      {
        group: "Datos Personales",
        fields: [
          {
            type: "text",
            props: {
              name: "Apellido",
              label: "Apellido",
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "text",
            props: {
              name: "Nombre",
              label: "Nombre",
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "text",
            props: {
              name: "NroDocumento",
              label: "DNI",
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "text",
            props: {
              name: "CUIL",
              label: "CUIL",
              // rules: { required: "Este campo es requerido" }, // User said "todos los campos son obligatorios"
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "calendar",
            props: {
              name: "FechaNacimiento",
              label: "Fecha de Nacimiento",
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "dropdown",
            props: {
              name: "Genero",
              label: "Género",
              options: [
                { label: "MASCULINO", value: "MASCULINO" },
                { label: "FEMENINO", value: "FEMENINO" },
              ],
              optionLabel: "label",
              optionValue: "value",
              placeholder: "Seleccione género",
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "text",
            props: {
              name: "Nacionalidad",
              label: "Nacionalidad",
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "text",
            props: {
              name: "Direccion",
              label: "Domicilio (Calle y Altura)",
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 12, lg: 6 },
          },
          {
            type: "text",
            props: {
              name: "Barrio",
              label: "Barrio",
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "dropdown", // Changed from select to dropdown
            props: {
              name: "Id_Provincia",
              label: "Provincia",
              options: provinciasOptions,
              optionLabel: "label",
              optionValue: "value",
              placeholder: "Seleccione una provincia",
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "dropdown",
            props: {
              name: "Id_Localidad",
              label: "Localidad",
              options: filteredLocalidades,
              optionLabel: "label",
              optionValue: "value",
              placeholder: "Seleccione una localidad",
              disabled: !selectedProvincia,
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "text",
            props: {
              name: "Telefono",
              label: "Teléfono",
              // rules: { required: "Este campo es requerido" }, // User said "si no lo completa no se envia null si no ''", hinting optional?
              // "Todos los campos son obligatorios".
              // But also "Telefono (es string por defecto string vacio)".
              // I will make it required as per "todos son obligatorios".
              rules: { required: "Este campo es requerido" },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
          {
            type: "text",
            props: {
              name: "Email",
              label: "Email",
              rules: {
                required: "Este campo es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              },
            },
            colSpan: { xs: 12, md: 6, lg: 3 },
          },
        ],
      },
    ];
  }, [provinciasQuery.data, localitiesQuery.data, selectedProvincia]);

  const handleLocalSubmit = (data: FieldValues) => {
    // Transform data to PacienteData
    const pacienteData: PacienteData = {
      Apellido: data.Apellido,
      Nombre: data.Nombre,
      NroDocumento: data.NroDocumento,
      FechaNacimiento: data.FechaNacimiento
        ? new Date(data.FechaNacimiento).toISOString()
        : "",
      Direccion: data.Direccion,
      Barrio: data.Barrio,
      Id_Localidad: data.Id_Localidad,
      Telefono: data.Telefono || "",
      Email: data.Email,
      Nacionalidad: data.Nacionalidad, // Pass through
      CUIL: data.CUIL, // Pass through
      Genero: data.Genero,
    };
    onSubmit(pacienteData);
  };

  if (provinciasQuery.isLoading || localitiesQuery.isLoading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="mx-9 sm:mx-14 md:mx-20 lg:mx-70 xl:mx-76 my-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Datos Personales</h1>
      <p className="mb-4 text-gray-600">
        Por favor verifique y complete sus datos personales.
      </p>

      <MedinttForm
        control={control as any}
        sections={sections as any}
        onSubmit={handleLocalSubmit}
        handleSubmit={handleSubmit}
        footer={
          <MedinttButton
            label="Continuar"
            type="submit"
            icon="pi pi-arrow-right"
            loading={isLoading}
          />
        }
      />
    </div>
  );
}
