import { sendParentMessage } from "@/app/login/page";
import { login } from "@/queries/login";
import { LoginDto, LoginResponseDto, TYPE_LOGIN } from "@medintt/types-auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FieldValues } from "react-hook-form";

export function useLoginHook() {
  const {
    mutate: loginHook,
    isPending: loginPending,
    isError: loginError,
    isSuccess: loginSuccess,
    ...rest
  } = useMutation({
    mutationFn: async (data: FieldValues) => {
      const user = await login(data as LoginDto);
      return user;
    },
    onSuccess: (data: LoginResponseDto) => {
      sendParentMessage(TYPE_LOGIN.SUCCESS, { user: data });
    },
    onError: (error: AxiosError) => {
      sendParentMessage(TYPE_LOGIN.ERROR, { error });
    },
  });

  return { loginHook, loginError, loginPending, loginSuccess, rest };
}
