import {
  LoginResponseDto,
  TYPE_LOGIN,
} from "@medintt/types-auth/dist/auth/login.type";
import { AxiosError } from "axios";

export const sendParentMessage = (
  type: TYPE_LOGIN,
  data?: {
    user?: LoginResponseDto;
    error?: AxiosError;
  },
) => {
  if (typeof window !== "undefined" && window.parent) {
    const message: {
      type: TYPE_LOGIN;
      error?: AxiosError;
      user?: LoginResponseDto;
    } = { type };
    if (data?.error) message.error = data?.error;
    if (data?.user) message.user = data?.user;
    window.parent.postMessage(message, "*");
  }
};
