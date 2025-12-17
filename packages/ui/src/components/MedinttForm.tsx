"use client";

import { FieldValues, Control } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { Fieldset } from "primereact/fieldset";

import { MedinttInputText } from "./MedinttInputText";
import { MedinttInputNumber } from "./MedinttInputNumber";
import { MedinttDropdown } from "./MedinttDropdown";
import { MedinttCalendar } from "./MedinttCalendar";
import { MedinttPassword } from "./MedinttPassword";
import { MedinttCheckbox } from "./MedinttCheckbox";
import { MedinttInputTextArea } from "./MedinttInputTextArea";
import { MedinttMultiSelect } from "./MedinttMultiSelect";
import { MedinttChips } from "./MedinttChips";
import { MedinttRadioButton } from "./MedinttRadioButton";
import { MedinttFormProps, FieldDefinition } from "../types/form";

const colSpanClasses: Record<number, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  11: "md:col-span-11",
  12: "md:col-span-12",
};

const renderField = <T extends FieldValues>(
  field: FieldDefinition<T>,
  control: Control<T>
) => {
  const { type, props } = field;
  const commonProps = { control, ...props };

  switch (type) {
    case "text":
      return <MedinttInputText {...(commonProps as any)} />;
    case "number":
      return <MedinttInputNumber {...(commonProps as any)} />;
    case "dropdown":
      return <MedinttDropdown {...(commonProps as any)} />;
    case "calendar":
      return <MedinttCalendar {...(commonProps as any)} />;
    case "password":
      return <MedinttPassword {...(commonProps as any)} />;
    case "checkbox":
      return <MedinttCheckbox {...(commonProps as any)} />;
    case "textarea":
      return <MedinttInputTextArea {...(commonProps as any)} />;
    case "multiselect":
      return <MedinttMultiSelect {...(commonProps as any)} />;
    case "chips":
      return <MedinttChips {...(commonProps as any)} />;
    case "radio":
      return <MedinttRadioButton {...(commonProps as any)} />;
    default:
      return null;
  }
};

export const MedinttForm = <T extends FieldValues>({
  control,
  sections,
  onSubmit,
  handleSubmit,
  className,
  footer,
}: MedinttFormProps<T>) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={twMerge("flex flex-col gap-6 w-full", className)}
    >
      {sections.map((section, index) => (
        <Fieldset
          key={index}
          legend={section.group}
          className="border border-surface-border rounded-lg bg-surface-card px-4"
          pt={{
            legend: { className: "text-lg font-semibold text-primary px-2" },
            content: { className: "p-6" },
          }}
        >
          {/* Grid de 12 columnas */}
          <div className="grid grid-cols-12 gap-4">
            {section.fields.map((field) => {
              const span = field.colSpan || 12;

              // 2. Usamos el mapa en lugar de interpolación dinámica
              // col-span-12 es el default para móvil, el mapa aplica desde 'md'
              const colClass = `col-span-12 ${colSpanClasses[span]}`;

              return (
                <div key={field.props.name} className={colClass}>
                  {renderField(field, control)}
                </div>
              );
            })}
          </div>
        </Fieldset>
      ))}

      {footer && (
        <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-surface-border">
          {footer}
        </div>
      )}
    </form>
  );
};
