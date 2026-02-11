"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  MedinttGuard,
  MedinttTable,
  MedinttForm,
  MedinttButton,
} from "@medintt/ui";
import { checkPermissions } from "@/services/permissions";
import { Role } from "@medintt/types-auth";
import { useRoles } from "@/hooks/useRoles";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { useToast } from "@/context/ToastContext";
import { useForm } from "react-hook-form";

export default function RolesPage() {
  const { user } = useAuth();
  const { roles, isLoading, createRole, isCreating, updateRole, isUpdating } =
    useRoles();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const toast = useToast();

  const { control, handleSubmit, reset } = useForm<Role>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  useEffect(() => {
    if (selectedRole) {
      reset(selectedRole);
    } else {
      reset({ name: "", code: "", description: "" });
    }
  }, [selectedRole, reset]);

  const isAdmin = checkPermissions(
    user,
    process.env.NEXT_PUBLIC_SELF_PROJECT!,
    process.env.NEXT_PUBLIC_ROLE_ADMIN!,
  );

  const openNew = () => {
    setSelectedRole(undefined);
    setIsDialogVisible(true);
  };

  const openEdit = (role: Role) => {
    setSelectedRole(role);
    setIsDialogVisible(true);
  };

  const hideDialog = () => {
    setIsDialogVisible(false);
    setSelectedRole(undefined);
    reset({ name: "", code: "", description: "" });
  };

  const handleSave = async (data: Role) => {
    try {
      if (selectedRole?.id) {
        await updateRole({ ...data, id: selectedRole.id });
        toast.show({
          severity: "success",
          summary: "Éxito",
          detail: "Rol actualizado",
        });
      } else {
        await createRole(data);
        toast.show({
          severity: "success",
          summary: "Éxito",
          detail: "Rol creado",
        });
      }
      hideDialog();
    } catch (error) {
      toast.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar el rol",
      });
    }
  };

  // Header Actions
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
        label="Crear"
        icon="pi pi-plus"
        severity="success"
        onClick={openNew}
      />
    </MedinttGuard>
  );

  // Row Actions
  const actionBodyTemplate = (rowData: Role) => (
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
        icon="pi pi-pencil"
        rounded
        text
        severity="warning"
        onClick={() => openEdit(rowData)}
      />
    </MedinttGuard>
  );

  const columns = [
    { field: "name", header: "Nombre" },
    { field: "code", header: "Código" },
    { field: "description", header: "Descripción" },
  ];

  const formSections: any[] = [
    {
      group: "Información del Rol",
      fields: [
        {
          type: "text",
          colSpan: 12,
          props: {
            name: "name",
            label: "Nombre",
            rules: { required: "El nombre es requerido" },
          },
        },
        {
          type: "text",
          colSpan: 12,
          props: {
            name: "code",
            label: "Código",
            rules: { required: false },
          },
        },
        {
          type: "text",
          colSpan: 12,
          props: {
            name: "description",
            label: "Descripción",
            rules: { required: false },
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
        loading={isCreating || isUpdating}
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
        <h1 className="text-2xl font-bold mb-4">Roles</h1>

        <MedinttTable
          data={roles || []}
          columns={columns}
          loading={isLoading}
          headerActions={headerActions}
          actions={isAdmin ? actionBodyTemplate : undefined}
        />

        <Dialog
          visible={isDialogVisible}
          style={{ width: "450px" }}
          header={selectedRole ? "Editar Rol" : "Nuevo Rol"}
          modal
          onHide={hideDialog}
        >
          <MedinttForm
            control={control}
            sections={formSections}
            onSubmit={handleSave}
            handleSubmit={handleSubmit}
            footer={formFooter}
          />
        </Dialog>
      </div>
    </MedinttGuard>
  );
}
