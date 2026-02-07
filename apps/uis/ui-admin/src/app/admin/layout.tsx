"use client";

import { MedinttSidebar, MedinttMenuItem, SidebarUser } from "@medintt/ui";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Image from "next/image";
import pkg from "../../../package.json";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated (optional, but good UX)
  // MedinttGuard in pages handles access control, but basic auth check here is fine.
  useEffect(() => {
    if (!isLoading && !user) {
      // Handle redirect or let Guard handle it
    }
  }, [user, isLoading, router]);

  const items: MedinttMenuItem[] = useMemo(() => {
    return [
      {
        label: "Mailing",
        icon: "pi pi-envelope",
        command: () => router.push("/admin/mailing"),
      },
      {
        label: "Proyectos",
        icon: "pi pi-folder",
        command: () => router.push("/admin/projects"),
      },
      {
        label: "Usuarios",
        icon: "pi pi-users",
        command: () => router.push("/admin/users"),
      },
      {
        label: "Auditoria",
        icon: "pi pi-list",
        command: () => router.push("/admin/audit"),
      },
    ];
  }, [router]);

  const sidebarUser: SidebarUser = {
    name: user?.email || "Usuario",
    // Assuming user has a members array and we want the role for 'admin' app?
    // Or just displaying main role? MedinttSideBar expects a single string for role display.
    // Let's try to get role for this app code 'admin'.
    role:
      user?.members?.find((m) => m.project.code === "admin")?.role || "Sin Rol",
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
