import { forgotPassword } from "@/queries/forgot-password";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordDto } from "@medintt/types-auth";
import { AxiosError } from "axios";

export function useForgotPassword() {
  const {
    mutate: forgotPasswordMutate,
    isPending: forgotPasswordPending,
    isSuccess: forgotPasswordSuccess,
    error: forgotPasswordError,
  } = useMutation({
    mutationFn: (data: ForgotPasswordDto) => forgotPassword(data),
  });

  return {
    forgotPasswordMutate,
    forgotPasswordPending,
    forgotPasswordSuccess,
    forgotPasswordError,
  };
}
