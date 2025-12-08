"use client";

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
        <PanelMenu model={items} className="w-full md:w-20rem" />
        <div className="flex flex-col border-2 border-green-500">
          <div className="w-full border-2 border-black">Hola</div>
          <div className="w-full border-2 border-amber-500">Mundo</div>
        </div>
        {/* {logout && (
          // IMPORTANTE: Cambié el <span> por un <div> y añadí clases de espaciado
          <div className="flex flex-col border-t-2 pt-4 mt-2 gap-2">
            <div className="flex flex-col text-sm text-gray-600 mb-2">
              <span className="font-bold">{user?.name}</span>
              <span className="italic">{user?.role}</span>
            </div>

            <MedinttButton
              label={logout?.label}
              icon={logout?.icon}
              severity="danger"
              className="w-full" // Para que el botón ocupe todo el ancho
              onClick={() => {
                logout?.command && logout?.command();
                logout?.url && router.push(logout.url);
              }}
            />
            <span className="text-xs text-center text-gray-400 mt-1">
              {version}
            </span>
          </div>
        )} */}
      </Sidebar>
      <MedinttButton
        icon="pi pi-bars"
        severity="secondary"
        onClick={() => setVisible(true)}
      />
    </div>
  );
};
