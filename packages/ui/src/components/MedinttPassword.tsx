"use client";

import { Password, PasswordProps } from "primereact/password";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface MedinttPasswordProps<T extends FieldValues>
  extends Omit<PasswordProps, "name"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

export const MedinttPassword = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  className,
  feedback = false, // Por defecto ocultamos la barra de fortaleza (mejor para Login)
  toggleMask = true, // Por defecto mostramos el ojito
  ...props
}: MedinttPasswordProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={twMerge("flex flex-col gap-2 p-fluid", className)}>
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

          <Password
            id={field.name}
            {...field}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            toggleMask={toggleMask}
            feedback={feedback}
            className={twMerge(
              "w-full flex relative",
              "[&_svg]:absolute [&_svg]:right-3 [&_svg]:top-1/2 [&_svg]:-translate-y-1/2 [&_svg]:mt-2 [&_svg]:cursor-pointer [&_svg]:text-gray-500",
              fieldState.invalid && "p-invalid"
            )}
            inputClassName={twMerge(
              "w-full p-3",
              fieldState.invalid &&
                "border-red-500 ring-1 ring-red-500 focus:ring-red-500"
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
