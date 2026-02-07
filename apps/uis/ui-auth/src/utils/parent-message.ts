import { TYPE_LOGIN } from "@medintt/types-auth/dist/auth/login.type";
import { User } from "@medintt/types-auth/dist/auth/user.type";
import { AxiosError } from "axios";

export const sendParentMessage = (
  type: TYPE_LOGIN,
  data?: {
    user?: User;
    error?: AxiosError;
  },
) => {
  if (typeof window !== "undefined" && window.parent) {
    const message: {
      type: TYPE_LOGIN;
      error?: AxiosError;
      user?: User;
    } = { type };
    if (data?.error) message.error = data?.error;
    if (data?.user) message.user = data?.user;
    window.parent.postMessage(message, "*");
  }
};
