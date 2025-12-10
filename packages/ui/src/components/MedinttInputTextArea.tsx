"use client";

import React from "react";
import { InputTextarea, InputTextareaProps } from "primereact/inputtextarea";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface MedinttInputTextAreaProps<T extends FieldValues>
  extends Omit<InputTextareaProps, "name" | "value" | "onChange"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

export const MedinttInputTextArea = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  className,
  rows = 5,
  autoResize = false,
  placeholder,
  ...props
}: MedinttInputTextAreaProps<T>) => {
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

          <InputTextarea
            id={field.name}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            
            rows={rows}
            autoResize={autoResize}
            placeholder={placeholder}
            
            className={twMerge(
              "w-full",
              fieldState.invalid && 
              "p-invalid border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500"
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