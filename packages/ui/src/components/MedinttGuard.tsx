import React from "react";
import { User } from "@medintt/types-auth";

interface MedinttGuardProps {
  children: React.ReactNode;
  user: User | null;
  appCode: string;
  requiredRole?: string | string[];
  fallback?: React.ReactNode;
}

export function MedinttGuard({
  children,
  user,
  appCode,
  requiredRole,
  fallback = null,
}: MedinttGuardProps) {
  if (!user) return <>{fallback}</>;

  // 1. "God Mode" para Super Admin (Prioridad máxima)
  if (user.isSuperAdmin) return <>{children}</>;

  // 2. Buscamos si pertenece a esta App
  const membership = user.members?.find((m) => m.project.code === appCode);

  if (!membership) return <>{fallback}</>;

  // 3. Si no pide rol específico, con ser miembro basta
  if (!requiredRole) return <>{children}</>;

  // 4. Chequeo de Roles
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasRole = roles.includes(membership.role);

  return hasRole ? <>{children}</> : <>{fallback}</>;
}
