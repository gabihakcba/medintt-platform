import React from "react";

interface MedinttGuardProps<T> {
  children: React.ReactNode;
  data: T;
  validator: (data: T) => boolean;
  fallback?: React.ReactNode;
}

export function MedinttGuard<T>({
  children,
  data,
  validator,
  fallback = null,
}: MedinttGuardProps<T>) {
  const hasAccess = validator(data);
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
