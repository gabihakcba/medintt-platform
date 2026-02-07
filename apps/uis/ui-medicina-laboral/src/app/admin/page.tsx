"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const hasAccess =
    user?.isSuperAdmin ||
    user?.members?.some(
      (member) => member.project.code === process.env.NEXT_PUBLIC_SELF_PROJECT,
    );

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !hasAccess) {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, router, hasAccess]);

  if (isLoading || !isAuthenticated || !hasAccess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">
        Bienvenido al Panel de Administración
      </h1>
    </main>
  );
}
