"use client";

import { checkPermissions } from "@/services/permissions";

import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import { useAuth } from "@/hooks/useAuth";
import {
  MedinttGuard,
  MedinttTable,
  MedinttToast,
  MedinttButton,
  MedinttForm,
  MedinttColumnConfig,
} from "@medintt/ui";
import { useProjects } from "@/hooks/useProjects";
import { useForm } from "react-hook-form";
import { CreateProjectData, ProjectData } from "@/queries/projects";

export default function ProjectsPage() {
  const { user } = useAuth();
  const {
    projects,
    isLoading,
    createProject,
    isCreating,
    updateProject,
    deleteProject,
    isUpdating,
    isDeleting,
  } = useProjects();
  const [visible, setVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null,
  );
  const toast = useRef<Toast>(null);

  const form = useForm<CreateProjectData>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  // Check permissions: SuperAdmin OR Admin of 'admin' project
  const canEdit = checkPermissions(
    user,
    process.env.NEXT_PUBLIC_SELF_PROJECT!,
    process.env.NEXT_PUBLIC_ROLE_ADMIN!,
  );

  // Effect to reset form when modal opens
  useEffect(() => {
    if (visible) {
      if (selectedProject) {
        form.reset({
          name: selectedProject.name,
          code: selectedProject.code,
          description: selectedProject.description || "",
        });
      } else {
        form.reset({
          name: "",
          code: "",
          description: "",
        });
      }
    }
  }, [visible, selectedProject, form]);

  const onSubmit = async (data: CreateProjectData) => {
    try {
      if (selectedProject) {
        await updateProject({ id: selectedProject.id, data });
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Proyecto actualizado correctamente",
          life: 3000,
        });
      } else {
        await createProject(data);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Proyecto creado correctamente",
          life: 3000,
        });
      }
      setVisible(false);
      setSelectedProject(null);
      form.reset();
    } catch (error: any) {
      console.error(error);
      const action = selectedProject ? "actualizar" : "crear";
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || `Error al ${action} proyecto`,
        life: 3000,
      });
    }
  };

  const confirmDelete = (proj: ProjectData) => {
    confirmDialog({
      message: `¿Estás seguro que deseas eliminar el proyecto "${proj.name}"?`,
      header: "Confirmar Eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Sí, Eliminar",
      rejectLabel: "Cancelar",
      accept: async () => {
        try {
          await deleteProject(proj.id);
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Proyecto eliminado permanentemente",
            life: 3000,
          });
        } catch (error: any) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail:
              error.response?.data?.message || "Error al eliminar el proyecto",
            life: 3000,
          });
        }
      },
    });
  };

  const actionBodyTemplate = (rowData: ProjectData) => {
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
        <div className="flex justify-center gap-2">
          <MedinttButton
            icon="pi pi-pencil"
            severity="warning"
            onClick={() => {
              setSelectedProject(rowData);
              setVisible(true);
            }}
            tooltip="Editar"
          />
          <MedinttButton
            icon="pi pi-trash"
            severity="danger"
            onClick={() => confirmDelete(rowData)}
            tooltip="Eliminar"
            loading={isDeleting}
          />
        </div>
      </MedinttGuard>
    );
  };

  const columns: MedinttColumnConfig<ProjectData>[] = [
    { field: "name", header: "Nombre", sortable: true },
    { field: "code", header: "Código", sortable: true },
    { field: "description", header: "Descripción", sortable: true },
  ];

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
        onClick={() => {
          setSelectedProject(null);
          setVisible(true);
        }}
      />
    </MedinttGuard>
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
      <div className="p-4 h-full flex flex-col relative gap-4">
        <ConfirmDialog />
        <MedinttToast ref={toast} />

        <MedinttTable
          data={projects || []}
          columns={columns}
          loading={isLoading}
          enableGlobalFilter={true}
          globalFilterFields={["name", "description"]}
          title="Listado de Proyectos"
          headerActions={headerActions}
          actions={canEdit ? actionBodyTemplate : undefined}
          actionsHeader="Acciones"
          scrollable
          scrollHeight="flex"
          className="!mt-0"
        />

        <Dialog
          header={selectedProject ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => {
            setVisible(false);
            setSelectedProject(null);
          }}
        >
          <MedinttForm
            control={form.control}
            handleSubmit={form.handleSubmit}
            onSubmit={onSubmit}
            sections={[
              {
                group: "Datos del Proyecto",
                fields: [
                  {
                    type: "text",
                    colSpan: 12,
                    props: {
                      name: "name",
                      label: "Nombre",
                      placeholder: "Ingrese el nombre del proyecto",
                      rules: { required: "El nombre es obligatorio" },
                    },
                  },
                  {
                    type: "text",
                    colSpan: 12,
                    props: {
                      name: "code",
                      label: "Código",
                      placeholder: "Ingrese el código del proyecto",
                      rules: { required: "El código es obligatorio" },
                    },
                  },
                  {
                    type: "textarea",
                    colSpan: 12,
                    props: {
                      name: "description",
                      label: "Descripción",
                      placeholder: "Ingrese una descripción",
                      rows: 5,
                    },
                  },
                ],
              },
            ]}
            footer={
              <div className="flex justify-end gap-2 mt-4">
                <MedinttButton
                  label="Cancelar"
                  icon="pi pi-times"
                  severity="secondary"
                  onClick={() => setVisible(false)}
                  type="button"
                />
                <MedinttButton
                  label="Guardar"
                  icon="pi pi-save"
                  type="submit"
                  loading={isCreating || isUpdating}
                />
              </div>
            }
          />
        </Dialog>
      </div>
    </MedinttGuard>
  );
}
