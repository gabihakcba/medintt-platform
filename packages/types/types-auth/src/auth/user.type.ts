import { Member } from "./member.type";

export interface User {
  id: string;
  email: string;
  permissions?: Record<
    string,
    {
      role?: string;
      organizationId?: string;
    }
  >;
  isSuperAdmin: boolean;
  members?: Member[];
}
