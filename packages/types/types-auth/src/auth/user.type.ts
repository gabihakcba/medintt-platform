import { Member } from "./member.type";

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  lastName: string;
  dni: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
