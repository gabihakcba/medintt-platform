export type JwtPayload = {
  sub: string;
  email: string;
  username: string;
  isSuperAdmin: boolean;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
