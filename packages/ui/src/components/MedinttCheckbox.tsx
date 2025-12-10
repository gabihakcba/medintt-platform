"use client";

import { Checkbox, CheckboxProps } from "primereact/checkbox";
import { Controller, FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { MedinttCheckboxProps } from "../types/form";

export const MedinttCheckbox = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  className,
  disabled,
  ...props
}: MedinttCheckboxProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={twMerge("flex flex-col gap-1", className)}>
          <div className="flex items-center gap-2">
            <Checkbox
              inputId={field.name}
              onChange={(e) => field.onChange(e.checked)}
              checked={field.value || false}
              onBlur={field.onBlur}
              disabled={disabled}
              className={twMerge(fieldState.invalid && "p-invalid")}
              {...props}
            />

            {label && (
              <label
                htmlFor={field.name}
                className={twMerge(
                  "text-sm cursor-pointer select-none",
                  fieldState.invalid ? "text-red-500" : "text-text-main"
                )}
              >
                {label}
                {rules?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            )}
          </div>
          {fieldState.error && (
            <small className="text-red-500 text-xs ml-1">
              {fieldState.error.message}
            </small>
          )}
        </div>
      )}
    />
  );
};
