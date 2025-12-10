"use client";

import React from "react";
import { Chips, ChipsProps } from "primereact/chips";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface MedinttChipsProps<T extends FieldValues>
  extends Omit<ChipsProps, "name" | "value" | "onChange"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

export const MedinttChips = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  className,
  separator = ",", // Por defecto permitimos separar con coma
  max, // Opcional: limitar cantidad de chips
  placeholder,
  ...props
}: MedinttChipsProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={twMerge("flex flex-col gap-2 w-full", className)}>
          {label && (
            <label
              htmlFor={field.name}
              className={twMerge(
                "text-sm font-medium transition-colors",
                fieldState.invalid ? "text-red-500" : "text-text-main"
              )}
            >
              {label}
              {rules?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <Chips
            id={field.name}
            value={field.value || []} // Asegura array vacío si es null
            onChange={(e) => field.onChange(e.value)}
            onBlur={field.onBlur}
            
            separator={separator}
            max={max}
            placeholder={placeholder}
            
            className={twMerge(
              "w-full",
              fieldState.invalid && "p-invalid"
            )}
            // Pt es para personalizar clases internas de PrimeReact si fuera necesario
            pt={{
              container: {
                className: twMerge(
                  "w-full",
                  fieldState.invalid && "border-red-500 ring-1 ring-red-500 focus:ring-red-500"
                )
              },
              inputToken: {
                className: "p-0" // Ajuste fino para alineación
              }
            }}
            
            {...props}
          />

          {fieldState.error && (
            <small className="text-red-500 text-xs">
              {fieldState.error.message}
            </small>
          )}
        </div>
      )}
    />
  );
};