"use client";

import { MedinttSidebar, MedinttMenuItem, SidebarUser } from "@medintt/ui";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import pkg from "../../../package.json";
import { checkPermissions } from "@/services/permissions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [isLoading, user, router]);

  const items: MedinttMenuItem[] = useMemo(() => {
    const hasAccess = checkPermissions(
      user,
      process.env.NEXT_PUBLIC_SELF_PROJECT!,
      [
        process.env.NEXT_PUBLIC_ROLE_ADMIN!,
        process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
      ],
    );

    if (!hasAccess) return [];

    return [
      {
        label: "Inicio",
        icon: "pi pi-home",
        command: () => router.push("/admin"),
      },
      {
        label: "Ausentismos",
        icon: "pi pi-calendar-times",
        command: () => router.push("/admin/ausentismos"),
      },
      {
        label: "Empleados",
        icon: "pi pi-users",
        command: () => router.push("/admin/empleados"),
      },
      {
        label: "Cloud",
        icon: "pi pi-cloud",
        command: () => router.push("/admin/cloud"),
      },
    ];
  }, [router, user]);

  const sidebarUser: SidebarUser = {
    name: user?.email || "Usuario",
    role: user?.isSuperAdmin
      ? "SuperAdmin"
      : user?.members?.find(
          (m) => m.project.code === process.env.NEXT_PUBLIC_SELF_PROJECT!,
        )?.role || "Sin Rol",
  };

  if (!user && isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Cargando...
      </div>
    );

  return (
    <div className="flex h-screen w-full">
      <MedinttSidebar
        title={
          <div className="flex items-center gap-2">
            <Image
              src="/logo_large.png"
              alt="Medintt Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        }
        items={items}
        user={sidebarUser}
        version={`v${pkg.version}`}
        logout={{
          label: "Cerrar Sesión",
          icon: "pi pi-power-off",
          command: () => logout(),
        }}
      />
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
