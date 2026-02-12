import { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { ButtonProps } from "primereact/button";
import { CalendarProps } from "primereact/calendar";
import { CheckboxProps } from "primereact/checkbox";
import { ChipsProps } from "primereact/chips";
import { DropdownProps } from "primereact/dropdown";
import { InputNumberProps } from "primereact/inputnumber";
import { InputTextProps } from "primereact/inputtext";
import { InputTextareaProps } from "primereact/inputtextarea";
import { MultiSelectProps } from "primereact/multiselect";
import { PasswordProps } from "primereact/password";
import { RadioButtonProps } from "primereact/radiobutton";

export interface MedinttButtonProps extends ButtonProps {
  tooltip?: string;
}

type CalendarViewMode = "date" | "month" | "year";
export interface MedinttCalendarProps<T extends FieldValues> extends Omit<
  CalendarProps,
  "name" | "value" | "onChange" | "view"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  viewMode?: CalendarViewMode;
}

export interface MedinttCheckboxProps<T extends FieldValues> extends Omit<
  CheckboxProps,
  "name" | "checked" | "value"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

export interface MedinttChipsProps<T extends FieldValues> extends Omit<
  ChipsProps,
  "name" | "value" | "onChange"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

type OptionSelector = string | ((item: any) => any);

export interface MedinttDropdownProps<T extends FieldValues> extends Omit<
  DropdownProps,
  | "name"
  | "value"
  | "onChange"
  | "loading"
  | "optionLabel"
  | "optionValue"
  | "filterBy"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  loading?: boolean;

  optionLabel?: OptionSelector;
  optionValue?: OptionSelector;

  filter?: boolean;
  filterBy?: string; // Ej: "name", "User.name", "name,lastname"
}

export interface MedinttInputNumberProps<T extends FieldValues> extends Omit<
  InputNumberProps,
  "name" | "value" | "onChange"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

export interface MedinttInputTextProps<T extends FieldValues> extends Omit<
  InputTextProps,
  "name"
> {
  name: Path<T>;
  control: Control<T>;
  autoComplete?: "on" | "off";
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  className?: string;
}

export interface MedinttInputTextAreaProps<T extends FieldValues> extends Omit<
  InputTextareaProps,
  "name" | "value" | "onChange"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

type OptionMultiSelector = string | ((item: any) => any);

export interface MedinttMultiSelectProps<T extends FieldValues> extends Omit<
  MultiSelectProps,
  | "name"
  | "value"
  | "onChange"
  | "loading"
  | "optionLabel"
  | "optionValue"
  | "filterBy"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
  loading?: boolean;

  optionLabel?: OptionMultiSelector;
  optionValue?: OptionMultiSelector;

  filter?: boolean;
  filterBy?: string;
}

export interface MedinttPasswordProps<T extends FieldValues> extends Omit<
  PasswordProps,
  "name"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

type OptionRadioSelector = string | ((item: any) => any);

export interface MedinttRadioButtonProps<T extends FieldValues> extends Omit<
  RadioButtonProps,
  "name" | "value" | "onChange" | "checked"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;

  options: any[];
  optionLabel?: OptionRadioSelector;
  optionValue?: OptionRadioSelector;

  layout?: "horizontal" | "vertical";
}

export interface ResponsiveColSpan {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export type ColSpan = number | ResponsiveColSpan;

export type FieldDefinition<T extends FieldValues> =
  | {
      type: "text";
      props: Omit<MedinttInputTextProps<T>, "control">;
      colSpan?: ColSpan;
    }
  | {
      type: "number";
      props: Omit<MedinttInputNumberProps<T>, "control">;
      colSpan?: ColSpan;
    }
  | {
      type: "dropdown";
      props: Omit<MedinttDropdownProps<T>, "control">;
      colSpan?: ColSpan;
    }
  | {
      type: "calendar";
      props: Omit<MedinttCalendarProps<T>, "control">;
      colSpan?: ColSpan;
    }
  | {
      type: "password";
      props: Omit<MedinttPasswordProps<T>, "control">;
      colSpan?: ColSpan;
    }
  | {
      type: "checkbox";
      props: Omit<MedinttCheckboxProps<T>, "control">;
      colSpan?: ColSpan;
    }
  | {
      type: "textarea";
      props: Omit<MedinttInputTextAreaProps<T>, "control">;
      colSpan?: ColSpan;
    }
  | {
      type: "multiselect";
      props: Omit<MedinttMultiSelectProps<T>, "control">;
      colSpan?: ColSpan;
    }
  | {
      type: "chips";
      props: Omit<MedinttChipsProps<T>, "control">;
      colSpan?: ColSpan;
    }
  | {
      type: "radio";
      props: Omit<MedinttRadioButtonProps<T>, "control">;
      colSpan?: ColSpan;
    };

export interface FormSection<T extends FieldValues> {
  group: string;
  fields: FieldDefinition<T>[];
}

export interface MedinttFormProps<T extends FieldValues> {
  control: Control<T>;
  sections: FormSection<T>[];
  onSubmit: (data: T) => void;
  handleSubmit: any;
  className?: string;
  footer?: React.ReactNode;
}
