"use client";

import { Toast, ToastMessage, ToastProps } from "primereact/toast";
import { forwardRef } from "react";

export interface MedinttToastProps {
  className?: string;
  props?: ToastProps;
}

export type MedinttToastMessage = ToastMessage;

export const MedinttToast = forwardRef<Toast, MedinttToastProps>(
  (props, ref) => {
    return (
      <Toast
        ref={ref}
        className={props.className}
        position="top-right"
        {...props.props}
      />
    );
  },
);

MedinttToast.displayName = "MedinttToast";
