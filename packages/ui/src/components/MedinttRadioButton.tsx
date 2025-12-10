"use client";

import React, { useMemo } from "react";
import { RadioButton, RadioButtonProps } from "primereact/radiobutton";
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

interface MedinttRadioButtonProps<T extends FieldValues>
  extends Omit<RadioButtonProps, "name" | "value" | "onChange" | "checked"> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;

  options: any[];
  optionLabel?: OptionSelector;
  optionValue?: OptionSelector;

  layout?: "horizontal" | "vertical";
}

export const MedinttRadioButton = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
  className,
  options,
  optionLabel = "label",
  optionValue = "value",
  layout = "horizontal",
  disabled,
  ...props
}: MedinttRadioButtonProps<T>) => {
  const processedOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) return [];

    return options.map((item, index) => ({
      label: resolveItemData(item, optionLabel),
      value: resolveItemData(item, optionValue),
      key: `${name}_${index}`,
      original: item,
    }));
  }, [options, optionLabel, optionValue, name]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={twMerge("flex flex-col gap-2", className)}>
          {label && (
            <label
              className={twMerge(
                "text-sm font-medium transition-colors",
                fieldState.invalid ? "text-red-500" : "text-text-main"
              )}
            >
              {label}
              {rules?.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <div
            className={twMerge(
              "flex gap-4",
              layout === "horizontal" ? "flex-row flex-wrap" : "flex-col"
            )}
          >
            {processedOptions.map((option) => {
              const inputId = `${option.key}_radio`;

              return (
                <div key={option.key} className="flex items-center gap-2">
                  <RadioButton
                    inputId={inputId}
                    name={field.name}
                    value={option.value}
                    onChange={(e) => field.onChange(e.value)}
                    checked={field.value === option.value}
                    disabled={disabled}
                    className={twMerge(fieldState.invalid && "p-invalid")}
                    invalid={fieldState.invalid}
                    {...props}
                  />
                  <label
                    htmlFor={inputId}
                    className={twMerge(
                      "cursor-pointer select-none text-sm",
                      fieldState.invalid ? "text-red-500" : "text-text-main"
                    )}
                  >
                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>

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
