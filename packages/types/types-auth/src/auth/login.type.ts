import { User } from "./user.type";

export class LoginResponseDto {
  user: User;
}

export class LoginTypeDto {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export enum TYPE_LOGIN {
  ERROR = "MEDINTT_AUTH_ERROR",
  SUCCESS = "MEDINTT_AUTH_SUCCESS",
  CANCLED = "MEDINTT_AUTH_CANCELED",
  FORGOT = "MEDINTT_AUTH_FORGOT",
}
