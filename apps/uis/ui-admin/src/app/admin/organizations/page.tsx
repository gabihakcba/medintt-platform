"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  MedinttGuard,
  MedinttTable,
  MedinttForm,
  MedinttButton,
} from "@medintt/ui";
import { checkPermissions } from "@/services/permissions";
import { Organization } from "@medintt/types-auth";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { useToast } from "@/context/ToastContext";
import { useForm } from "react-hook-form";

export default function OrganizationsPage() {
  const { user } = useAuth();
  const {
    organizations,
    isLoading,
    createOrganization,
    updateOrganization,
    isCreating,
    isUpdating,
  } = useOrganizations();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<
    Organization | undefined
  >(undefined);
  const toast = useToast();

  const { control, handleSubmit, reset } = useForm<Organization>({
    defaultValues: {
      name: "",
      code: "",
      cuit: "",
    },
  });

  useEffect(() => {
    if (selectedOrganization) {
      reset(selectedOrganization);
    } else {
      reset({ name: "", code: "", cuit: "" });
    }
  }, [selectedOrganization, reset]);

  const isAdmin = checkPermissions(
    user,
    process.env.NEXT_PUBLIC_SELF_PROJECT!,
    process.env.NEXT_PUBLIC_ROLE_ADMIN!,
  );

  const openNew = () => {
    setSelectedOrganization(undefined);
    setIsDialogVisible(true);
  };

  const openEdit = (org: Organization) => {
    setSelectedOrganization(org);
    setIsDialogVisible(true);
  };

  const hideDialog = () => {
    setIsDialogVisible(false);
    setSelectedOrganization(undefined);
    reset({ name: "", code: "", cuit: "" });
  };

  const handleSave = async (data: Organization) => {
    try {
      if (selectedOrganization?.id) {
        await updateOrganization({ ...data, id: selectedOrganization.id });
        toast.show({
          severity: "success",
          summary: "Éxito",
          detail: "Organización actualizada",
        });
      } else {
        await createOrganization(data);
        toast.show({
          severity: "success",
          summary: "Éxito",
          detail: "Organización creada",
        });
      }
      hideDialog();
    } catch (error) {
      toast.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar la organización",
      });
    }
  };

  // Header Actions (Create Button)
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

  // Row Actions (Edit Button)
  const actionBodyTemplate = (rowData: Organization) => (
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
    { field: "cuit", header: "CUIT" },
  ];

  const formSections: any[] = [
    {
      group: "Información de la Organización",
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
            rules: { required: "El código es requerido" },
          },
        },
        {
          type: "text",
          colSpan: 12,
          props: {
            name: "cuit",
            label: "CUIT",
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
        <h1 className="text-2xl font-bold mb-4">Organizaciones</h1>

        <MedinttTable
          data={organizations || []}
          columns={columns}
          loading={isLoading}
          headerActions={headerActions}
          actions={isAdmin ? actionBodyTemplate : undefined}
        />

        <Dialog
          visible={isDialogVisible}
          style={{ width: "450px" }}
          header={
            selectedOrganization ? "Editar Organización" : "Nueva Organización"
          }
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
