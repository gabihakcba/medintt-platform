import { sendParentMessage } from "@/app/login/page";
import { login } from "@/queries/login";
import { useState } from "react";
import {
  LoginTypeDto,
  LoginResponseDto,
  TYPE_LOGIN,
} from "@medintt/types-auth/dist/auth/login.type";
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
      const user = await login(data as LoginTypeDto);
      return user;
    },
    onSuccess: (data: LoginResponseDto) => {
      sendParentMessage(TYPE_LOGIN.SUCCESS, { user: data });
    },
    onError: (error: AxiosError) => {
      // @ts-expect-error type
      if (error.response?.data?.code === "2FA_REQUIRED") {
        setIsTwoFactorRequired(true);
        return;
      }
      sendParentMessage(TYPE_LOGIN.ERROR, { error });
    },
  });

  const [isTwoFactorRequired, setIsTwoFactorRequired] = useState(false);

  return {
    loginHook,
    loginError,
    loginPending,
    loginSuccess,
    isTwoFactorRequired,
    rest,
  };
}
