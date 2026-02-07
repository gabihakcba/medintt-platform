"use client";

import { MedinttGuard } from "@medintt/ui";
import { useAuth } from "@/hooks/useAuth";

export default function ProjectsPage() {
  const { user } = useAuth();

  return (
    <MedinttGuard user={user || null} appCode="admin" requiredRole="ADMIN">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sección Proyectos</h1>
      </div>
    </MedinttGuard>
  );
}
