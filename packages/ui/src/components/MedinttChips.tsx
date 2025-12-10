"use client";

import { Chips } from "primereact/chips";
import { Controller, FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { MedinttChipsProps } from "../types/form";

export const MedinttChips = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  className,
  separator = ",",
  max,
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
            value={field.value || []}
            onChange={(e) => field.onChange(e.value)}
            onBlur={field.onBlur}
            separator={separator}
            max={max}
            placeholder={placeholder}
            className={twMerge("w-full", fieldState.invalid && "p-invalid")}
            pt={{
              container: {
                className: twMerge(
                  "w-full",
                  fieldState.invalid &&
                    "border-red-500 ring-1 ring-red-500 focus:ring-red-500"
                ),
              },
              inputToken: {
                className: "p-0",
              },
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
