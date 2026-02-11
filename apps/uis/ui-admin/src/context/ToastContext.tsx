import { createContext, useContext } from "react";
import { ToastMessage } from "primereact/toast";

export interface ToastContextType {
  show: (message: ToastMessage | ToastMessage[]) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
