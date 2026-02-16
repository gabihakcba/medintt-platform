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

    const menuItems: MedinttMenuItem[] = [
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
        label: "Incidentes Laborales",
        icon: "pi pi-exclamation-triangle",
        command: () => router.push("/admin/incidentes-laborales"),
      },
      {
        label: "Empleados",
        icon: "pi pi-users",
        command: () => router.push("/admin/empleados"),
      },
      {
        label: "Cloud",
        icon: "", // Dummy icon to satisfy type definition
        template: (item, options) => {
          return (
            <a
              href={process.env.NEXT_PUBLIC_CLOUD_MEDINTT!}
              className={options.className}
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior and potential framework interference
                options.onClick(e); // inform PrimeReact (might set active state, etc)
                window.open(process.env.NEXT_PUBLIC_CLOUD_MEDINTT, "_blank");
              }}
            >
              <span className={options.iconClassName}>
                <Image
                  src="/favicon_cropped1.png"
                  alt="Cloud"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              </span>
              <span className={options.labelClassName}>{item.label}</span>
            </a>
          );
        },
      },
    ];
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
              src="/logo_no_bg.png"
              alt="Medintt Logo"
              width={120}
              height={120}
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
