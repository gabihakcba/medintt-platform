import { resetPassword } from "@/queries/reset-password";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordDto } from "@medintt/types-auth";

export function useResetPassword() {
  const {
    mutate: resetPasswordMutate,
    isPending: resetPasswordPending,
    isSuccess: resetPasswordSuccess,
    error: resetPasswordError,
  } = useMutation({
    mutationFn: (data: ResetPasswordDto) => resetPassword(data),
  });

  return {
    resetPasswordMutate,
    resetPasswordPending,
    resetPasswordSuccess,
    resetPasswordError,
  };
}
