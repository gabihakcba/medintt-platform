"use client";

import { useRef } from "react";
import { Toast, ToastMessage } from "primereact/toast";
import { MedinttToast } from "@medintt/ui";
import { ToastContext } from "../context/ToastContext";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toastRef = useRef<Toast>(null);

  const show = (message: ToastMessage | ToastMessage[]) => {
    toastRef.current?.show(message);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <MedinttToast ref={toastRef} />
    </ToastContext.Provider>
  );
};
