"use client";

import { Calendar } from "primereact/calendar";
import { Controller, FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { parseToJsDate, toIsoString } from "@medintt/utils";
import { MedinttCalendarProps } from "../types/form";

export const MedinttCalendar = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  className,
  viewMode = "date",
  dateFormat,
  placeholder,
  ...props
}: MedinttCalendarProps<T>) => {
  // date: dd/mm/yy
  // month: mm/yy
  // year: yy
  const getDateFormat = () => {
    if (dateFormat) return dateFormat;

    switch (viewMode) {
      case "month":
        return "mm/yy";
      case "year":
        return "yy";
      default:
        return "dd/mm/yy";
    }
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
                fieldState.invalid ? "text-red-500" : "text-text-main",
              )}
            >
              {label}
              {rules?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <Calendar
            id={field.name}
            value={parseToJsDate(field.value)}
            onChange={(e) => field.onChange(toIsoString(e.value as Date))}
            onBlur={field.onBlur}
            view={viewMode}
            dateFormat={getDateFormat()}
            showIcon
            placeholder={placeholder}
            className={twMerge("w-full", fieldState.invalid && "p-invalid")}
            inputClassName={twMerge(
              "w-full",
              fieldState.invalid &&
                "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500",
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
