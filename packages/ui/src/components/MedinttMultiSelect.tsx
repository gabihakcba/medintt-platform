"use client";

import React, { useMemo } from "react";
import { MultiSelect, MultiSelectProps } from "primereact/multiselect";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { resolveItemData } from "../utils/resolve";

type OptionSelector = string | ((item: any) => any);

interface MedinttMultiSelectProps<T extends FieldValues>
  extends Omit<
    MultiSelectProps,
    | "name"
    | "value"
    | "onChange"
    | "loading"
    | "optionLabel"
    | "optionValue"
    | "filterBy"
  > {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  loading?: boolean;

  optionLabel?: OptionSelector;
  optionValue?: OptionSelector;

  filter?: boolean;
  filterBy?: string; // Ej: "name", "User.name", "name,lastname"
}

export const MedinttMultiSelect = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  loading = false,
  className,
  options,
  placeholder,
  optionLabel = "label",
  optionValue = "value",
  filter,
  filterBy,
  virtualScrollerOptions,
  maxSelectedLabels = 3, // Default de UX: mostrar hasta 3, luego "N items seleccionados"
  selectedItemsLabel = "{0} seleccionados", // Texto cuando se supera el máximo
  ...props
}: MedinttMultiSelectProps<T>) => {
  
  // 1. Normalización de opciones (Igual que en Dropdown)
  const processedOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) return [];

    return options.map((item) => ({
      label: resolveItemData(item, optionLabel),
      value: resolveItemData(item, optionValue),
      original: item, // Guardamos la data original para filtros profundos
    }));
  }, [options, optionLabel, optionValue]);

  // 2. Filtro inteligente (Redirige la búsqueda a 'original.')
  const resolvedFilterBy = useMemo(() => {
    if (!filterBy) return "label";

    return filterBy
      .split(",")
      .map((field) => {
        const f = field.trim();
        if (f === "label" || f === "value") return f;
        return `original.${f}`;
      })
      .join(",");
  }, [filterBy]);

  // 3. Virtual Scroll por defecto
  const defaultVirtualScrollerOptions = {
    itemSize: 50, // Altura estándar de item
    ...virtualScrollerOptions,
  };

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

          <MultiSelect
            id={field.name}
            value={field.value || []} // Aseguramos array vacío si es null/undefined
            onChange={(e) => field.onChange(e.value)}
            onBlur={field.onBlur}
            
            options={processedOptions}
            optionLabel="label"
            optionValue="value"
            
            filter={filter}
            filterBy={resolvedFilterBy}
            resetFilterOnHide
            
            virtualScrollerOptions={defaultVirtualScrollerOptions}
            
            // Configuración visual extra para MultiSelect
            maxSelectedLabels={maxSelectedLabels}
            selectedItemsLabel={selectedItemsLabel}
            display="chip" // O "comma". "chip" suele verse más moderno en dashboards
            
            loading={loading}
            placeholder={placeholder}
            className={twMerge(
              "w-full",
              fieldState.invalid &&
                "p-invalid border-red-500 ring-1 ring-red-500 focus:ring-red-500"
            )}
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