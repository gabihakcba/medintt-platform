"use client";

import { InputNumber } from "primereact/inputnumber";
import { Controller, FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { MedinttInputNumberProps } from "../types/form";

export const MedinttInputNumber = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  className,

  maxFractionDigits = 3,
  minFractionDigits = 0,
  mode = "decimal",
  ...props
}: MedinttInputNumberProps<T>) => {
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

          <InputNumber
            id={field.name}
            value={field.value}
            onValueChange={(e) => field.onChange(e.value)}
            onBlur={field.onBlur}
            mode={mode}
            maxFractionDigits={maxFractionDigits}
            minFractionDigits={minFractionDigits}
            className={twMerge("w-full")}
            invalid={fieldState.invalid}
            inputClassName={twMerge(
              "w-full",
              fieldState.invalid &&
                "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500"
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
