// MedinttSideBar.tsx content is fine, no changes needed for export syntax if "export interface" is used.
// The issue might be in layout.tsx usage or next.js build process with workspace packages.
// Let's try to verify if `SidebarUser` is reachable.
// Actually, `MedinttSideBar` uses `MenuItem` from `primereact/menuitem`.
// ui-admin has `primereact` installed.
// Let's look at the error again: "ReferenceError: React is not defined" or similar? No, "command finished with error".
// The traceback showed `ui-admin/src/app/admin/layout.tsx [Server Component]`.
// But `layout.tsx` starts with "use client".
// Next.js might be treating it as Server Component initally?
// Wait, `layout.tsx` imports `MedinttSideBar` which is "use client".
// If `MedinttSideBar` is imported from `@medintt/ui`, and `@medintt/ui` is not transpiled correctly?
// Usually workspace packages need to be transpiled.
// `next.config.js` in `ui-admin` might need `transpilePackages: ["@medintt/ui"]`.
// Let's check `next.config.js`.

import { ReactNode, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { MedinttButton } from "./MedinttButton";
import { PanelMenu } from "primereact/panelmenu";
import { useRouter } from "next/navigation";
import { MenuItem } from "primereact/menuitem";

export interface MedinttMenuItem extends MenuItem {
  label: string;
  icon: string;
  url?: string;
  command?: () => void;
  items?: MedinttMenuItem[];
}

export interface SidebarUser {
  name: string;
  role?: string;
}

export interface MedinttSidebarProps {
  title: ReactNode;
  items: MedinttMenuItem[];
  user: SidebarUser;
  version: string;
  logout?: Omit<MedinttMenuItem, "items">;
}

export const MedinttSidebar = ({
  title,
  items,
  user,
  version,
  logout,
}: MedinttSidebarProps) => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <div>
      <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}
        header={title}
      >
        {/* 1. CONTENEDOR FLEX PRINCIPAL (Ocupa toda la altura) */}
        <div className="flex flex-col h-full">
          {/* 2. ZONA DEL MENÚ (Flexible y Scrollable) */}
          {/* flex-grow: empuja el footer hacia abajo */}
          {/* overflow-y-auto: permite scroll solo en esta sección si el menú es muy largo */}
          <div className="grow overflow-y-auto">
            <PanelMenu model={items} className="w-full" />
          </div>

          {/* 3. ZONA INFERIOR (Fija) */}
          {/* flex-shrink-0: evita que se aplaste si hay poco espacio */}
          {logout && (
            <div className="shrink-0 flex flex-col border-t gap-2">
              {user && (
                <div className="px-3 py-2 bg-surface-overlay rounded-lg">
                  <p className="text-xs text-text-secondary mb-1">
                    Conectado como:
                  </p>
                  <p className="text-text-main font-semibold text-sm truncate">
                    {user?.name}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span
                      key={user?.role}
                      className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                    >
                      {user?.role}
                    </span>
                  </div>
                </div>
              )}

              <MedinttButton
                label={logout?.label}
                icon={logout?.icon}
                severity="danger"
                className="w-full"
                onClick={() => {
                  logout?.command && logout?.command();
                  logout?.url && router.push(logout.url);
                }}
              />
              <span className="text-xs text-center text-gray-400 mt-1">
                {version}
              </span>
            </div>
          )}
        </div>
      </Sidebar>
      <MedinttButton
        className="m-2"
        icon="pi pi-bars"
        severity="secondary"
        onClick={() => setVisible(true)}
      />
    </div>
  );
};
