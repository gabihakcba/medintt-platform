"use client";

import { useMemo } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Controller, FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { resolveItemData } from "../utils/resolve";
import { MedinttMultiSelectProps } from "../types/form";

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
  maxSelectedLabels = 3,
  selectedItemsLabel = "{0} seleccionados",
  ...props
}: MedinttMultiSelectProps<T>) => {
  const processedOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) return [];

    return options.map((item) => ({
      label: resolveItemData(item, optionLabel),
      value: resolveItemData(item, optionValue),
      original: item,
    }));
  }, [options, optionLabel, optionValue]);

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

  const defaultVirtualScrollerOptions = {
    itemSize: 50,
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
            value={field.value || []}
            onChange={(e) => field.onChange(e.value)}
            onBlur={field.onBlur}
            options={processedOptions}
            optionLabel="label"
            optionValue="value"
            filter={filter}
            filterBy={resolvedFilterBy}
            resetFilterOnHide
            virtualScrollerOptions={defaultVirtualScrollerOptions}
            maxSelectedLabels={maxSelectedLabels}
            selectedItemsLabel={selectedItemsLabel}
            display="chip"
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
