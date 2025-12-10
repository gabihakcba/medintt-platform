"use client";

import { Checkbox, CheckboxProps } from "primereact/checkbox";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface MedinttCheckboxProps<T extends FieldValues>
  extends Omit<CheckboxProps, "name" | "checked" | "value"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

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
              className={twMerge(
                fieldState.invalid && "p-invalid"
              )}
              {...props}
            />
            
            {label && (
              <label
                htmlFor={field.name}
                className={twMerge(
                  "text-sm cursor-pointer select-none", // select-none mejora UX al hacer clic
                  fieldState.invalid ? "text-red-500" : "text-text-main"
                )}
              >
                {label}
                {rules?.required && <span className="text-red-500 ml-1">*</span>}
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