import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendingData,
  sendPendingDataEmail,
} from "../queries/datos-pendientes";

export const usePendingData = () => {
  const queryClient = useQueryClient();

  const {
    data: pendingData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pending-data"],
    queryFn: getPendingData,
  });

  const sendEmailMutation = useMutation({
    mutationFn: sendPendingDataEmail,
    onSuccess: () => {
      // Optional: invalidate query or handle success locally
    },
  });

  return {
    pendingData,
    isLoading,
    error,
    sendEmail: sendEmailMutation.mutateAsync,
    isSending: sendEmailMutation.isPending,
  };
};
