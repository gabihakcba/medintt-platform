import { User, Role } from "@medintt/types-auth";

export const checkPermissions = (
  user: User | null | undefined,
  projectCode: string,
  requiredRole?: string | string[],
): boolean => {
  if (!user) return false;

  // 1. Super Admin (God Mode)
  if (user.isSuperAdmin) return true;

  // 2. Find membership for this project
  const membership = user.members?.find((m) => m.project.code === projectCode);

  if (!membership) return false;

  // 3. If no specific role is required, existing membership is enough
  if (!requiredRole) return true;

  // 4. Check Roles
  // Normalize membership role to string (handle object or string)
  const memberRoleCode =
    typeof membership.role === "string"
      ? membership.role
      : (membership.role as Role).code;

  const requiredRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  return requiredRoles.includes(memberRoleCode);
};
