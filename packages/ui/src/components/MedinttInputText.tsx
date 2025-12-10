"use client";

import { InputText } from "primereact/inputtext";
import { Controller, FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { MedinttInputTextProps } from "../types/form";

export const MedinttInputText = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  className,
  autoComplete = "off",
  ...props
}: MedinttInputTextProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={twMerge("flex flex-col gap-2", className)}>
          {label && (
            <label
              htmlFor={field.name}
              className="text-text-main font-medium text-sm"
            >
              {label}
              {rules?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <InputText
            id={field.name}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            className={twMerge(
              "w-full",
              fieldState.invalid && "p-invalid border-red-500"
            )}
            autoComplete={autoComplete}
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
