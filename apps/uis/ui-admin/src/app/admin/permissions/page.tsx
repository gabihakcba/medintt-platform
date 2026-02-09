"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  MedinttGuard,
  MedinttTable,
  MedinttForm,
  MedinttButton,
} from "@medintt/ui";
import { checkPermissions } from "@/services/permissions";
import { Permission } from "@medintt/types-auth";
import { usePermissions } from "@/hooks/usePermissions";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useToast } from "@/context/ToastContext";

export default function PermissionsPage() {
  const { user } = useAuth();
  const {
    permissions,
    isLoading,
    createPermission,
    updatePermission,
    isCreating,
    isUpdating,
  } = usePermissions();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<
    Permission | undefined
  >(undefined);
  const toast = useToast();

  const { control, handleSubmit, reset } = useForm<Permission>({
    defaultValues: {
      resource: "",
      action: "",
      code: "",
    },
  });

  useEffect(() => {
    if (selectedPermission) {
      reset(selectedPermission);
    } else {
      reset({ resource: "", action: "", code: "" });
    }
  }, [selectedPermission, reset]);

  const isAdmin = checkPermissions(
    user,
    process.env.NEXT_PUBLIC_SELF_PROJECT!,
    process.env.NEXT_PUBLIC_ROLE_ADMIN!,
  );

  const openNew = () => {
    setSelectedPermission(undefined);
    setIsDialogVisible(true);
  };

  const openEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDialogVisible(true);
  };

  const hideDialog = () => {
    setIsDialogVisible(false);
    setSelectedPermission(undefined);
    reset({ resource: "", action: "", code: "" });
  };

  const handleSave = async (data: Permission) => {
    try {
      if (selectedPermission?.id) {
        await updatePermission({ ...data, id: selectedPermission.id });
        toast.show({
          severity: "success",
          summary: "Éxito",
          detail: "Permiso actualizado",
        });
      } else {
        await createPermission(data);
        toast.show({
          severity: "success",
          summary: "Éxito",
          detail: "Permiso creado",
        });
      }
      hideDialog();
    } catch (error) {
      toast.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar el permiso",
      });
    }
  };

  // Header Actions
  const headerActions = (
    <MedinttGuard
      data={user}
      validator={(u) =>
        checkPermissions(u, process.env.NEXT_PUBLIC_SELF_PROJECT!, "ADMIN")
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
  const actionBodyTemplate = (rowData: Permission) => (
    <MedinttGuard
      data={user}
      validator={(u) =>
        checkPermissions(u, process.env.NEXT_PUBLIC_SELF_PROJECT!, "ADMIN")
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
    { field: "resource", header: "Recurso" },
    { field: "action", header: "Acción" },
    { field: "code", header: "Código" },
  ];

  const formSections: any[] = [
    {
      group: "Información del Permiso",
      fields: [
        {
          type: "text",
          colSpan: 12,
          props: {
            name: "resource",
            label: "Recurso",
            rules: { required: "El recurso es requerido" },
          },
        },
        {
          type: "text",
          colSpan: 12,
          props: {
            name: "action",
            label: "Acción",
            rules: { required: "La acción es requerida" },
          },
        },
        {
          type: "text",
          colSpan: 12,
          props: {
            name: "code",
            label: "Código",
            rules: { required: "El código es requerido" },
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
        <h1 className="text-2xl font-bold mb-4">Permisos</h1>

        <MedinttTable
          data={permissions || []}
          columns={columns}
          loading={isLoading}
          headerActions={headerActions}
          actions={isAdmin ? actionBodyTemplate : undefined}
        />

        <Dialog
          visible={isDialogVisible}
          style={{ width: "450px" }}
          header={selectedPermission ? "Editar Permiso" : "Nuevo Permiso"}
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
