"use client";

import { Button } from "primereact/button";
import { twMerge } from "tailwind-merge";
import { MedinttButtonProps } from "../types/form";

export const MedinttButton = ({
  size = "small",
  outlined = true,
  iconPos = "right",
  tooltip,
  className,
  ...props
}: MedinttButtonProps) => {
  const finalClass = twMerge(className);

  return (
    <Button
      size={size}
      outlined={outlined}
      iconPos={iconPos}
      className={finalClass}
      tooltip={tooltip}
      tooltipOptions={{
        appendTo: typeof document !== "undefined" ? document?.body : undefined,
        position: "top",
      }}
      {...props}
    />
  );
};
