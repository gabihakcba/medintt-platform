"use client";

import { Toast, ToastMessage } from "primereact/toast";
import { forwardRef } from "react";

export interface MedinttToastProps {
  className?: string;
}

export type MedinttToastMessage = ToastMessage;

export const MedinttToast = forwardRef<Toast, MedinttToastProps>(
  (props, ref) => {
    return <Toast ref={ref} className={props.className} position="top-right" />;
  },
);

MedinttToast.displayName = "MedinttToast";
