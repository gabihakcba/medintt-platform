"use client";

import {
  MedinttForm,
  MedinttButton,
  FormSection,
  FieldDefinition,
} from "@medintt/ui";
import { ReactElement, useMemo } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { DeclaracionJurada } from "@/queries/declaracion-jurada";
import {
  PacienteResponse,
  EmpresaResponse,
} from "@/queries/declaracion-jurada";
import { Divider } from "primereact/divider";
import { HeaderDeclaracion } from "./HeaderDeclaracion";

interface FormularioProps {
  initialData?: DeclaracionJurada;
  paciente: PacienteResponse;
  empresa: EmpresaResponse;
  onSubmit: (data: DeclaracionJurada) => void;
  isLoading?: boolean;
}

export default function Formulario({
  initialData,
  paciente,
  empresa,
  onSubmit,
  isLoading = false,
}: FormularioProps): ReactElement {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: initialData,
  });

  const formValues = watch();

  const sections: FormSection<FieldValues>[] = useMemo(() => {
    // Helper to check if a field is "Si" (1)
    const isTrue = (fieldName: keyof DeclaracionJurada) =>
      (formValues as Partial<DeclaracionJurada>)[fieldName] === 1;

    // Helper for Clinical History Items pairs
    const createClinicalHistoryItem = (
      key: keyof DeclaracionJurada,
      label: string,
      clarificationLabel: string = "Aclaraciones",
      invertLogic: boolean = false,
    ): FieldDefinition<FieldValues>[] => {
      // If invertLogic is true, we want it enabled when value is 0 ("No")
      const isPositive = invertLogic
        ? (formValues as Partial<DeclaracionJurada>)[key] === 0
        : (formValues as Partial<DeclaracionJurada>)[key] === 1;

      const requiredMessage = invertLogic
        ? "Este campo es requerido al seleccionar No"
        : "Este campo es requerido al seleccionar Si";

      return [
        {
          type: "radio",
          colSpan: 3,
          props: {
            name: key,
            label: label,
            options: [
              { label: "Si", value: 1 },
              { label: "No", value: 0 },
            ],
            layout: "horizontal",
            rules: { required: "Este campo es requerido" },
          },
        },
        {
          type: "text",
          colSpan: 3,
          props: {
            name: `${key}_Aclaraciones`,
            label: clarificationLabel,
            disabled: !isPositive,
            rules: {
              required: isPositive ? requiredMessage : false,
            },
          },
        },
      ];
    };

    const allSections: FormSection<FieldValues>[] = [
      {
        group: "Hábitos Personales",
        fields: [
          {
            type: "radio",
            colSpan: 3,
            props: {
              name: "Fuma",
              label: "Fuma",
              options: [
                { label: "Si", value: 1 },
                { label: "No", value: 0 },
              ],
              layout: "horizontal",
              rules: { required: "Este campo es requerido" },
            },
          },
          {
            type: "number",
            colSpan: 3,
            props: {
              name: "Cantidad_Cigarros_diarios",
              label: "Cantidad de cigarrillos por día",
              disabled: !isTrue("Fuma"),
              rules: { required: isTrue("Fuma") },
            },
          },
          {
            type: "radio",
            colSpan: 3,
            props: {
              name: "Consume_Alcohol",
              label: "Consume bebidas alcohólicas",
              options: [
                { label: "Si", value: 1 },
                { label: "No", value: 0 },
              ],
              layout: "horizontal",
              rules: { required: "Este campo es requerido" },
            },
          },
          {
            type: "text",
            colSpan: 3,
            props: {
              name: "Frecuencia",
              label: "Frecuencia",
              disabled: !isTrue("Consume_Alcohol"),
              rules: { required: isTrue("Consume_Alcohol") },
            },
          },
          {
            type: "radio",
            colSpan: 3,
            props: {
              name: "Practica_Deportes",
              label: "Practica deportes",
              options: [
                { label: "Si", value: 1 },
                { label: "No", value: 0 },
              ],
              layout: "horizontal",
              rules: { required: "Este campo es requerido" },
            },
          },
          {
            type: "text",
            colSpan: 3,
            props: {
              name: "Cuales_Deportes",
              label: "Cuáles",
              disabled: !isTrue("Practica_Deportes"),
              rules: { required: isTrue("Practica_Deportes") },
            },
          },
          {
            type: "radio",
            colSpan: 3,
            props: {
              name: "Mano_Habil",
              label: "Mano hábil",
              options: [
                { label: "Derecha", value: "Derecha" },
                { label: "Izquierda", value: "Izquierda" },
              ],
              layout: "horizontal",
              rules: { required: "Este campo es requerido" },
            },
          },
          {
            type: "text",
            colSpan: 3,
            props: {
              name: "Ultima_Tarea_Trabajo_Puesto",
              label: "Última tarea de trabajo / puesto",
            },
          },
          {
            type: "radio",
            colSpan: 6,
            props: {
              name: "Recibio_Indeminizacion_o_tiene_pendiente",
              label:
                "Ha recibido o tiene pendiente una indemnización por accidente de trabajo o enfermedad profesional?",
              options: [
                { label: "Si", value: 1 },
                { label: "No", value: 0 },
              ],
              layout: "horizontal",
              rules: { required: "Este campo es requerido" },
            },
          },
          {
            type: "text",
            colSpan: 3,
            props: {
              name: "Recibio_Indeminizacion_o_tiene_pendiente_Aclaraciones",
              label: "Motivo",
              disabled: !isTrue("Recibio_Indeminizacion_o_tiene_pendiente"),
              rules: {
                required: isTrue("Recibio_Indeminizacion_o_tiene_pendiente"),
              },
            },
          },
        ],
      },
      {
        group: "Historia Clínica Personal",
        fields: [
          ...createClinicalHistoryItem("Mareos_Desmayos", "Mareos/Desmayos"),
          ...createClinicalHistoryItem("Convulsiones", "Convulsiones"),
          ...createClinicalHistoryItem("Epilepsia", "Epilepsia"),
          ...createClinicalHistoryItem("Depresion", "Depresión"),
          ...createClinicalHistoryItem(
            "Enfermedad_Neurologica",
            "Enfermedad neurológica",
          ),
          ...createClinicalHistoryItem("Diabetes", "Diabetes"),
          ...createClinicalHistoryItem(
            "Dolor_Frecuente_de_Cabeza",
            "Dolor frec. de cabeza",
          ),
          ...createClinicalHistoryItem(
            "Toma_Medicacion",
            "Toma medicación ¿Cuál?",
          ),
          ...createClinicalHistoryItem(
            "Hipertension_Arterial",
            "Hipertensión arterial",
          ),
          ...createClinicalHistoryItem("Cardiopatias", "Cardiopatías"),
          ...createClinicalHistoryItem("Varices", "Várices"),
          ...createClinicalHistoryItem("Chagas", "Chagas"),
          ...createClinicalHistoryItem(
            "Dentadura_Sana",
            "Dentadura sana",
            "Aclaraciones",
            true,
          ),
          ...createClinicalHistoryItem("Alergias", "Alergia - especifique"),
          ...createClinicalHistoryItem("Tumor_Cancer", "Tumor/cáncer espec."),
          ...createClinicalHistoryItem("Hepatitis", "Hepatitis"),
          ...createClinicalHistoryItem(
            "Disminucion_Auditiva",
            "Disminución auditiva",
          ),
          ...createClinicalHistoryItem(
            "Tratamiento_Tiroides",
            "Tratamiento de tiroides",
          ),
          ...createClinicalHistoryItem(
            "Enfermedades_de_la_Piel",
            "Enfermedades de la piel",
          ),
          ...createClinicalHistoryItem(
            "Analisis_HIV",
            "¿Se realizó análisis HIV?",
          ),
          ...createClinicalHistoryItem("Asma_Tos_Cronica", "Asma, Tos crónica"),
          ...createClinicalHistoryItem("Neumonia", "Neumonía"),
          ...createClinicalHistoryItem(
            "Sangre_al_Escupir",
            "Sangre al escupir",
          ),
          ...createClinicalHistoryItem("Celiaquia", "Celiaquía"),
          ...createClinicalHistoryItem("Hernias", "Hernias - especifique"),
          ...createClinicalHistoryItem(
            "Tratamiento_Psiquiatrico",
            "Tratamiento psiquiátrico",
          ),
          ...createClinicalHistoryItem(
            "Fracturas",
            "Fracturas (huesos afectados)",
          ),
          ...createClinicalHistoryItem("Lumbalgia", "Lumbalgia"),
          ...createClinicalHistoryItem(
            "Problema_Renal_Urinario",
            "Problema renal/urinario",
          ),
          ...createClinicalHistoryItem(
            "Amputaciones",
            "Amputaciones - especifique",
          ),
          ...createClinicalHistoryItem(
            "Limitaciones_Funcionales",
            "Limitaciones funcionales",
          ),
          ...createClinicalHistoryItem(
            "Traumatismos_Lesiones",
            "Traumatismo y lesiones- especifique",
          ),
          ...createClinicalHistoryItem(
            "Enfermedades_Oculares",
            "Enfermedades oculares",
          ),
          ...createClinicalHistoryItem(
            "Uso_de_Lentes",
            "Uso de lentes, Motivos",
          ),
          ...createClinicalHistoryItem(
            "Ulcera_Gastrica_Nauseas_Vomitos",
            "Úlcera gástrica, Náuseas, vómitos",
          ),
          ...createClinicalHistoryItem("Cirugias", "Cirugías, ¿cuáles?"),
          ...createClinicalHistoryItem(
            "Internaciones",
            "Internaciones, motivos.",
          ),
          ...createClinicalHistoryItem(
            "Vacunas_COVID",
            "¿Recibió vacunación COVID?",
          ),
        ],
      },
      {
        group: "Consumo",
        fields: [
          ...createClinicalHistoryItem(
            "Consume_Marihuana",
            "Consume Marihuana",
          ),
          ...createClinicalHistoryItem("Consume_Cocaina", "Consume Cocaína"),
        ],
      },
      {
        group: "Anexo Mujer",
        fields: [
          {
            type: "radio",
            colSpan: 3,
            props: {
              name: "Tuvo_Algun_Embarazo",
              label: "Tuvo algún embarazo",
              options: [
                { label: "Si", value: 1 },
                { label: "No", value: 0 },
              ],
              layout: "horizontal",
              rules: { required: "Este campo es requerido" },
            },
          },
          {
            type: "text",
            colSpan: 3,
            props: {
              name: "Cuantos_Embarazos",
              label: "¿cuántos?",
              disabled: !isTrue("Tuvo_Algun_Embarazo"),
              rules: { required: isTrue("Tuvo_Algun_Embarazo") },
            },
          },
          {
            type: "radio",
            colSpan: 3,
            props: {
              name: "Abortos_Espontaneos",
              label: "Tuvo abortos espontáneos",
              options: [
                { label: "Si", value: 1 },
                { label: "No", value: 0 },
              ],
              layout: "horizontal",
              rules: { required: "Este campo es requerido" },
            },
          },
          {
            type: "number",
            colSpan: 3,
            props: {
              name: "Abortos_Espontaneos_Cuantos",
              label: "¿cuántos?",
              disabled: !isTrue("Abortos_Espontaneos"),
              rules: { required: isTrue("Abortos_Espontaneos") },
            },
          },
          {
            type: "radio",
            colSpan: 3,
            props: {
              name: "Tratamientos_Hormonales",
              label: "Tratamientos hormonales",
              options: [
                { label: "Si", value: 1 },
                { label: "No", value: 0 },
              ],
              layout: "horizontal",
              rules: { required: "Este campo es requerido" },
            },
          },
          {
            type: "text",
            colSpan: 3,
            props: {
              name: "Tratamientos_Hormonales_Aclaraciones",
              label: "Aclaraciones",
              disabled: !isTrue("Tratamientos_Hormonales"),
              rules: { required: isTrue("Tratamientos_Hormonales") },
            },
          },
          {
            type: "calendar",
            colSpan: 3,
            props: {
              name: "Fecha_Ultima_Menstruacion",
              label: "Fecha de última menstruación",
            },
          },
        ],
      },
    ];

    return allSections.filter(
      (s) => s.group !== "Anexo Mujer" || paciente.Genero === "FEMENINO",
    );
  }, [formValues, paciente.Genero]);

  const handleLocalSubmit = (data: DeclaracionJurada) => {
    const dataToSend = { ...data };
    if (paciente.Genero !== "FEMENINO") {
      // Set woman-specific fields to null if not female
      Object.assign(dataToSend, {
        Tuvo_Algun_Embarazo: null,
        Cuantos_Embarazos: null,
        Abortos_Espontaneos: null,
        Abortos_Espontaneos_Cuantos: null,
        Tratamientos_Hormonales: null,
        Tratamientos_Hormonales_Aclaraciones: null,
        Fecha_Ultima_Menstruacion: null,
      });
    }
    onSubmit(dataToSend);
  };

  return (
    <div className="mx-9 sm:mx-14 md:mx-20 lg:mx-70 xl:mx-76 my-10 space-y-6">
      <HeaderDeclaracion paciente={paciente} empresa={empresa} />

      <Divider />

      <div>
        <h1 className="text-2xl font-bold mb-4">Declaración Jurada</h1>
        <MedinttForm
          control={control}
          sections={sections as unknown as FormSection<DeclaracionJurada>[]}
          onSubmit={handleLocalSubmit}
          handleSubmit={handleSubmit}
          // className="w-full"
          footer={
            <MedinttButton
              label="Guardar"
              type="submit"
              icon="pi pi-upload"
              loading={isLoading}
            />
          }
        />
      </div>
    </div>
  );
}
