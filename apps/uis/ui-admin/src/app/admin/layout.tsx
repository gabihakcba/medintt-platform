"use client";

import { MedinttSidebar, MedinttMenuItem, SidebarUser } from "@medintt/ui";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import pkg from "../../../package.json";
import { checkPermissions } from "@/services/permissions";
import { ToastProvider } from "@/providers/ToastProvider";

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
    const isAdmin = checkPermissions(
      user,
      process.env.NEXT_PUBLIC_SELF_PROJECT!,
      process.env.NEXT_PUBLIC_ROLE_ADMIN!,
    );

    const menuItems: MedinttMenuItem[] = [
      {
        label: "Mailing",
        icon: "pi pi-envelope",
        command: () => router.push("/admin/mailing"),
      },
    ];

    if (isAdmin) {
      menuItems.push(
        {
          label: "Usuarios",
          icon: "pi pi-users",
          command: () => router.push("/admin/users"),
        },
        {
          label: "DDJJs pendientes",
          icon: "pi pi-fw pi-clock",
          command: () => router.push("/admin/declaraciones-pendientes"),
        },
        {
          label: "Membresías",
          icon: "pi pi-id-card",
          command: () => router.push("/admin/members"),
        },
        {
          label: "Proyectos",
          icon: "pi pi-folder",
          command: () => router.push("/admin/projects"),
        },
        {
          label: "Organizaciones",
          icon: "pi pi-building",
          command: () => router.push("/admin/organizations"),
        },
        {
          label: "Roles",
          icon: "pi pi-id-card",
          command: () => router.push("/admin/roles"),
        },
        {
          label: "Permisos",
          icon: "pi pi-key",
          command: () => router.push("/admin/permissions"),
        },
        {
          label: "Auditoria",
          icon: "pi pi-list",
          command: () => router.push("/admin/audit"),
        },
      );
    }

    return menuItems;
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
      <main className="flex-1 overflow-auto bg-gray-50">
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  );
}
