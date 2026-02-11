import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendientes,
  sendPendingEmails,
} from "../queries/declaracion-jurada";
import { useRef } from "react";
import { Toast } from "primereact/toast";

export const usePendingDDJJ = () => {
  const queryClient = useQueryClient();
  const toast = useRef<Toast>(null);

  const query = useQuery({
    queryKey: ["declaraciones-pendientes"],
    queryFn: getPendientes,
  });

  const sendEmailsMutation = useMutation({
    mutationFn: sendPendingEmails,
    onSuccess: (data) => {
      const successCount = data.filter((r) => r.success).length;
      const errorCount = data.length - successCount;

      if (successCount > 0) {
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: `Se enviaron ${successCount} correos exitosamente.`,
        });
      }

      if (errorCount > 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Advertencia",
          detail: `Hubo ${errorCount} errores al enviar correos.`,
        });
      }
    },
    onError: (error) => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Ocurrió un error al intentar enviar los correos.",
      });
      console.error(error);
    },
  });

  return {
    query,
    sendEmailsMutation,
    toastRef: toast,
  };
};
