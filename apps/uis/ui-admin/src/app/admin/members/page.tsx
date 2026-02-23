"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  MedinttGuard,
  MedinttTable,
  MedinttForm,
  MedinttButton,
} from "@medintt/ui";
import { checkPermissions } from "@/services/permissions";
import { useMembers } from "@/hooks/useMembers";
import { useUsers } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useProjects } from "@/hooks/useProjects";
import { useState, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { useToast } from "@/context/ToastContext";
import { useForm } from "react-hook-form";
import { CreateMemberData } from "@/queries/members";
import { DataTableExpandedRows } from "primereact/datatable";

export default function MembersPage() {
  const { user } = useAuth();
  const {
    usersWithMemberships,
    isLoading,
    deleteMember,
    isDeleting,
    createMember,
    isCreating,
  } = useMembers();
  const { users } = useUsers();
  const { roles } = useRoles();
  const { organizations: allOrganizations } = useOrganizations();
  const { projects } = useProjects();
  const toast = useToast();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | any[]
  >([]);

  const { control, handleSubmit, reset } = useForm<CreateMemberData>({
    defaultValues: {
      userId: "",
      projectId: "",
      roleId: "",
      organizationId: "",
    },
  });

  const usersData = useMemo(() => {
    if (!usersWithMemberships) return [];
    return usersWithMemberships.map((u) => ({
      ...u,
      userFullName: `${u.lastName} ${u.name}`,
    }));
  }, [usersWithMemberships]);

  const isAdmin = checkPermissions(
    user,
    process.env.NEXT_PUBLIC_SELF_PROJECT!,
    process.env.NEXT_PUBLIC_ROLE_ADMIN!,
  );

  const openNew = () => {
    reset({
      userId: "",
      projectId: "", // Maybe set default?
      roleId: "",
      organizationId: "",
    });
    setIsDialogVisible(true);
  };

  const hideDialog = () => {
    setIsDialogVisible(false);
    reset();
  };

  const handleCreate = async (data: CreateMemberData) => {
    try {
      await createMember(data);
      toast.show({
        severity: "success",
        summary: "Éxito",
        detail: "Membresía creada",
      });
      hideDialog();
    } catch (error) {
      toast.show({
        severity: "error",
        summary: "Error",
        detail: "Error al crear membresía",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMember(id);
      toast.show({
        severity: "success",
        summary: "Éxito",
        detail: "Membresía eliminada",
      });
    } catch (error) {
      toast.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar membresía",
      });
    }
  };

  const headerActions = (
    <MedinttGuard
      data={user}
      validator={(u) =>
        checkPermissions(
          u,
          process.env.NEXT_PUBLIC_SELF_PROJECT!,
          process.env.NEXT_PUBLIC_ROLE_ADMIN!,
        )
      }
    >
      <MedinttButton
        label="Asignar Miembro"
        icon="pi pi-plus"
        severity="success"
        onClick={openNew}
      />
    </MedinttGuard>
  );

  const actionBodyTemplate = (rowData: any) => (
    <MedinttGuard
      data={user}
      validator={(u) =>
        checkPermissions(
          u,
          process.env.NEXT_PUBLIC_SELF_PROJECT!,
          process.env.NEXT_PUBLIC_ROLE_ADMIN!,
        )
      }
    >
      <MedinttButton
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => handleDelete(rowData.id)}
        loading={isDeleting}
      />
    </MedinttGuard>
  );

  const columns = [
    { expander: true, style: { width: "4rem" }, header: "" },
    { field: "userFullName", header: "Usuario" },
    { field: "dni", header: "DNI" },
  ];

  const rowExpansionTemplate = (data: any) => {
    const memberSubColumns = [
      { field: "organizationName", header: "Organización" },
      { field: "roleName", header: "Rol" },
      { field: "projectName", header: "Proyecto" },
    ];

    const memberData = data.memberships?.map((m: any) => ({
      ...m,
      organizationName: m.organization?.name || "-",
      roleName: m.role?.name || "-",
      projectName: m.project?.name || "-",
    }));

    return (
      <div className="p-4">
        <h5 className="font-semibold mb-3">
          Membresías de {data.userFullName}
        </h5>
        <MedinttTable
          data={memberData || []}
          columns={memberSubColumns}
          actions={isAdmin ? actionBodyTemplate : undefined}
          paginator={false}
          className="shadow-none"
        />
      </div>
    );
  };

  const userOptions = useMemo(() => {
    return (
      users?.map((u: any) => ({
        label: `${u.lastName} ${u.name} - ${u.dni}`,
        value: u.id,
      })) || []
    );
  }, [users]);

  const roleOptions = useMemo(() => {
    return (
      roles?.map((r) => ({
        label: `${r.name} (${r.code})`,
        value: r.id,
      })) || []
    );
  }, [roles]);

  const orgOptions = useMemo(() => {
    return (
      allOrganizations?.map((o) => ({
        label: `${o.name} (${o.code}) - ${o.cuit}`,
        value: o.id,
      })) || []
    );
  }, [allOrganizations]);

  const projectOptions = useMemo(() => {
    return (
      projects?.map((p) => ({
        label: `${p.name} (${p.code})`,
        value: p.id,
      })) || []
    );
  }, [projects]);

  const formSections: any[] = [
    {
      group: "Asignación de Membresía",
      fields: [
        {
          type: "dropdown",
          colSpan: 12,
          props: {
            name: "userId",
            label: "Usuario",
            options: userOptions,
            rules: { required: "El usuario es requerido" },
            filter: true,
          },
        },
        {
          type: "dropdown",
          colSpan: 12,
          props: {
            name: "roleId",
            label: "Rol",
            options: roleOptions,
            rules: { required: "El rol es requerido" },
            filter: true,
          },
        },
        {
          type: "dropdown",
          colSpan: 12,
          props: {
            name: "organizationId",
            label: "Organización",
            options: orgOptions,
            rules: { required: "La organización es requerida" },
            filter: true,
          },
        },
        {
          type: "dropdown",
          colSpan: 12,
          props: {
            name: "projectId",
            label: "Proyecto",
            options: projectOptions,
            rules: { required: "El proyecto es requerido" },
            filter: true,
          },
        },
      ],
    },
  ];

  const formFooter = (
    <div className="flex justify-end gap-2">
      <MedinttButton
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
        type="button"
      />
      <MedinttButton
        label="Guardar"
        icon="pi pi-check"
        type="submit"
        loading={isCreating}
      />
    </div>
  );

  return (
    <MedinttGuard
      data={user}
      validator={(u) =>
        checkPermissions(
          u,
          process.env.NEXT_PUBLIC_SELF_PROJECT!,
          process.env.NEXT_PUBLIC_ROLE_ADMIN!,
        )
      }
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Membresías</h1>

        <MedinttTable
          data={usersData}
          columns={columns}
          loading={isLoading}
          headerActions={headerActions}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
        />

        <Dialog
          visible={isDialogVisible}
          style={{ width: "450px" }}
          header="Nueva Membresía"
          modal
          onHide={hideDialog}
        >
          <MedinttForm
            control={control}
            sections={formSections}
            onSubmit={handleCreate}
            handleSubmit={handleSubmit}
            footer={formFooter}
          />
        </Dialog>
      </div>
    </MedinttGuard>
  );
}
