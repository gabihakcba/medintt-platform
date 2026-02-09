import { useMutation } from "@tanstack/react-query";
import { confirmAccount } from "@/queries/confirm-account";

export const useConfirmAccount = () => {
  const mutation = useMutation({
    mutationFn: confirmAccount,
  });

  return {
    confirm: mutation.mutateAsync,
    isConfirming: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
