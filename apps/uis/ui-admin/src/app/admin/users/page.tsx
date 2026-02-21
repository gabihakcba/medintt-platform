"use client";

import { checkPermissions } from "@/services/permissions";

import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

import { useAuth } from "@/hooks/useAuth";
import {
  MedinttGuard,
  MedinttTable,
  MedinttToast,
  MedinttButton,
  MedinttForm,
  MedinttColumnConfig,
} from "@medintt/ui";
import { useUsers } from "@/hooks/useUsers";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useForm } from "react-hook-form";

interface UserData {
  id: string;
  email: string;
  username: string;
  name: string;
  lastName: string;
  dni: string;
  cargo?: string;
  celular?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserFormData {
  username: string;
  email: string;
  password?: string;
  name: string;
  lastName: string;
  dni: string;
  cargo: string;
  celular: string;
  organizationId?: string;
  roleCode?: string;
  projectCode?: string;
}

export default function UsersPage() {
  const { user } = useAuth();
  const {
    users,
    isLoading,
    createUser,
    isCreating,
    createInterlocutor,
    isCreatingInterlocutor,
    updateUser,
    isUpdating,
  } = useUsers();
  const { organizations, isLoading: isLoadingOrgs } = useOrganizations();
  const [isInterlocutorMode, setIsInterlocutorMode] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const toast = useRef<Toast>(null);

  const form = useForm<CreateUserFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      name: "",
      lastName: "",
      dni: "",
      cargo: "",
      celular: "",
      organizationId: "",
      roleCode: process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR || "",
      projectCode: process.env.NEXT_PUBLIC_MED_LAB_PROJECT || "",
    },
  });

  // Effect to reset form when modal opens
  useEffect(() => {
    if (visible) {
      if (selectedUser) {
        form.reset({
          username: selectedUser.username,
          email: selectedUser.email,
          password: "",
          name: selectedUser.name,
          lastName: selectedUser.lastName,
          dni: selectedUser.dni,
          cargo: selectedUser.cargo || "",
          celular: selectedUser.celular || "",
        });
      } else {
        form.reset({
          username: "",
          email: "",
          password: "",
          name: "",
          lastName: "",
          dni: "",
          cargo: "",
          celular: "",
          organizationId: "",
          roleCode: process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR || "",
          projectCode: process.env.NEXT_PUBLIC_MED_LAB_PROJECT || "",
        });
      }
    }
  }, [visible, selectedUser, form]);

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      if (selectedUser) {
        const updateData: any = { ...data };
        if (!updateData.password) delete updateData.password;

        await updateUser({ id: selectedUser.id, data: updateData });
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Usuario actualizado correctamente",
          life: 3000,
        });
      } else {
        if (isInterlocutorMode) {
          const userPayload = { ...data };
          if (!userPayload.password) delete userPayload.password;
          delete userPayload.organizationId;
          delete userPayload.roleCode;
          delete userPayload.projectCode;

          await createInterlocutor({
            user: userPayload as any,
            member: {
              organizationId: data.organizationId!,
              roleCode: process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
              projectCode: process.env.NEXT_PUBLIC_MED_LAB_PROJECT!,
            },
          });
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Interlocutor creado correctamente",
            life: 3000,
          });
        } else {
          const userPayload = { ...data };
          if (!userPayload.password) delete userPayload.password;
          delete userPayload.organizationId;
          delete userPayload.roleCode;
          delete userPayload.projectCode;

          await createUser(userPayload as any);
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Usuario creado correctamente",
            life: 3000,
          });
        }
      }
      setVisible(false);
      setSelectedUser(null);
      setIsInterlocutorMode(false);
      form.reset();
    } catch (error: any) {
      console.error(error);
      const action = selectedUser ? "actualizar" : "crear";
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.message || `Error al ${action} usuario`,
        life: 3000,
      });
    }
  };

  const booleanBodyTemplate = (rowData: UserData, field: keyof UserData) => {
    return (
      <i
        className={`pi ${
          rowData[field] ? "pi-check text-green-500" : "pi-times text-red-500"
        }`}
      ></i>
    );
  };

  const actionBodyTemplate = (rowData: UserData) => {
    return (
      <div className="flex justify-center gap-2">
        <MedinttButton
          icon="pi pi-pencil"
          severity="warning"
          onClick={() => {
            setSelectedUser(rowData);
            setVisible(true);
          }}
          tooltip="Editar"
        />
      </div>
    );
  };

  const columns: MedinttColumnConfig<UserData>[] = [
    { field: "username", header: "Usuario", sortable: true },
    { field: "email", header: "Email", sortable: true },
    { field: "name", header: "Nombre", sortable: true },
    { field: "lastName", header: "Apellido", sortable: true },
    { field: "dni", header: "DNI", sortable: true },
    {
      field: "isVerified",
      header: "Verificado",
      sortable: true,
      body: (data) => booleanBodyTemplate(data, "isVerified"),
      style: { width: "10rem", textAlign: "center" },
    },
    {
      field: "isActive",
      header: "Activo",
      sortable: true,
      body: (data) => booleanBodyTemplate(data, "isActive"),
      style: { width: "10rem", textAlign: "center" },
    },
  ];

  const headerActions = (
    <div className="flex gap-2">
      <MedinttButton
        label="Crear"
        icon="pi pi-plus"
        severity="success"
        onClick={() => {
          setSelectedUser(null);
          setIsInterlocutorMode(false);
          setVisible(true);
        }}
      />
      <MedinttButton
        label="Interlocutor"
        icon="pi pi-plus"
        severity="info"
        onClick={() => {
          setSelectedUser(null);
          setIsInterlocutorMode(true);
          setVisible(true);
        }}
        tooltip="Crear usuario directo con rol Interlocutor en Medicina Laboral"
      />
    </div>
  );

  const formSections = [
    {
      group: "Datos del Usuario",
      fields: [
        {
          type: "text",
          colSpan: 6,
          props: {
            name: "name",
            label: "Nombre",
            placeholder: "Ingrese el nombre",
            rules: { required: "El nombre es obligatorio" },
          },
        },
        {
          type: "text",
          colSpan: 6,
          props: {
            name: "lastName",
            label: "Apellido",
            placeholder: "Ingrese el apellido",
            rules: { required: "El apellido es obligatorio" },
          },
        },
        {
          type: "text",
          colSpan: 6,
          props: {
            name: "dni",
            label: "DNI",
            placeholder: "Ingrese el DNI",
            rules: { required: "El DNI es obligatorio" },
          },
        },
        {
          type: "text",
          colSpan: 6,
          props: {
            name: "username",
            label: "Usuario",
            placeholder: "Ingrese el nombre de usuario",
            rules: { required: "El nombre de usuario es obligatorio" },
          },
        },
        {
          type: "text",
          colSpan: 12,
          props: {
            name: "email",
            label: "Email",
            placeholder: "Ingrese el email",
            rules: {
              required: "El email es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            },
          },
        },
        {
          type: "text",
          colSpan: 6,
          props: {
            name: "cargo",
            label: "Cargo",
            placeholder: "Ingrese el cargo",
          },
        },
        {
          type: "text",
          colSpan: 6,
          props: {
            name: "celular",
            label: "Celular",
            placeholder: "Ingrese número de celular",
          },
        },
        {
          type: "password",
          colSpan: 12,
          props: {
            name: "password",
            label: "Contraseña",
            placeholder: selectedUser
              ? "Dejar en blanco para mantener la actual"
              : "Ingrese una contraseña",
            toggleMask: true,
            feedback: false,
            rules: selectedUser
              ? {
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                }
              : {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                },
          },
        },
      ] as any[],
    },
  ];

  if (isInterlocutorMode && !selectedUser) {
    formSections.push({
      group: "Datos de Asignación (Interlocutor)",
      fields: [
        {
          type: "dropdown",
          colSpan: 12,
          props: {
            name: "organizationId",
            label: "Organización (Prestataria)",
            options: organizations || [],
            optionLabel: "name",
            optionValue: "id",
            placeholder: "Seleccione una organización",
            loading: isLoadingOrgs,
            rules: { required: "La organización es obligatoria" },
          },
        },
        {
          type: "text",
          colSpan: 6,
          props: {
            name: "roleCode",
            label: "Rol",
            disabled: true,
          },
        },
        {
          type: "text",
          colSpan: 6,
          props: {
            name: "projectCode",
            label: "Proyecto",
            disabled: true,
          },
        },
      ] as any[],
    });
  }

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
        <MedinttToast ref={toast} />

        <MedinttTable
          data={users || []}
          columns={columns}
          loading={isLoading}
          enableGlobalFilter={true}
          globalFilterFields={["username", "name", "lastName", "email", "dni"]}
          title="Listado de Usuarios"
          headerActions={headerActions}
          actions={actionBodyTemplate}
          actionsHeader="Acciones"
          scrollable
          scrollHeight="flex"
          className="!mt-0"
        />

        <Dialog
          header={
            selectedUser
              ? "Editar Usuario"
              : isInterlocutorMode
                ? "Crear Nuevo Interlocutor"
                : "Crear Nuevo Usuario"
          }
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => {
            setVisible(false);
            setSelectedUser(null);
            setIsInterlocutorMode(false);
          }}
        >
          <MedinttForm
            control={form.control}
            handleSubmit={form.handleSubmit}
            onSubmit={onSubmit}
            sections={formSections}
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
                  loading={isCreating || isCreatingInterlocutor || isUpdating}
                />
              </div>
            }
          />
        </Dialog>
      </div>
    </MedinttGuard>
  );
}
