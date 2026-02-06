export type PermissionsPayload = Record<
  string,
  { role: string | undefined; organizationId: string | null }
>;

export type JwtPayload = {
  sub: string;
  email: string;
  username: string;
  isSuperAdmin: boolean;
  permissions: PermissionsPayload;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
