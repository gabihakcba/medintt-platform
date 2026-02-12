"use client";

import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/services/permissions";
import { MedinttGuard, MedinttTable } from "@medintt/ui";
import { useAusentismos } from "@/hooks/useAusentismos";
import { formatDate } from "@/lib/date";
import { Calendar } from "primereact/calendar";
import { useState } from "react";
import { AusentismosFilters } from "@/queries/ausentismos";

export default function AusentismosPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  const [mesReferencia, setMesReferencia] = useState<Date | null>(null);

  // Build filters based on state
  const filters: AusentismosFilters = {};
  if (dateRange && dateRange[0] && dateRange[1]) {
    filters.desde = dateRange[0].toISOString();
    filters.hasta = dateRange[1].toISOString();
  } else if (mesReferencia) {
    filters.mesReferencia = mesReferencia.toISOString();
  }

  const { ausentismos, isLoading } = useAusentismos(filters);

  const columns = [
    {
      field: "paciente.Apellido",
      header: "Apellido",
      body: (rowData: any) => rowData.paciente?.Apellido || "-",
    },
    {
      field: "paciente.Nombre",
      header: "Nombre",
      body: (rowData: any) => rowData.paciente?.Nombre || "-",
    },
    {
      field: "paciente.NroDocumento",
      header: "Nro Doc",
      body: (rowData: any) => rowData.paciente?.NroDocumento || "-",
    },
    {
      field: "prestataria.Nombre",
      header: "Empresa",
      hidden: !checkPermissions(user, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
        process.env.NEXT_PUBLIC_ROLE_ADMIN!,
      ]),
      body: (rowData: any) => rowData.prestataria?.Nombre || "-",
    },
    {
      field: "Fecha_Desde",
      header: "Desde",
      body: (rowData: any) => formatDate(rowData.Fecha_Desde),
    },
    {
      field: "Fecha_Hasta",
      header: "Hasta",
      body: (rowData: any) => formatDate(rowData.Fecha_Hasta),
    },
    {
      field: "Fecha_Reincoporacion",
      header: "Reincorporación",
      body: (rowData: any) => formatDate(rowData.Fecha_Reincoporacion),
    },
    {
      field: "Ausentismos_Categorias.Categoria",
      header: "Categoría",
      body: (rowData: any) => rowData.Ausentismos_Categorias?.Categoria || "-",
    },
    { field: "Diagnostico", header: "Diagnóstico" },
    { field: "Evolucion", header: "Evolución" },
    {
      field: "actions",
      header: "Acciones",
      hidden: !checkPermissions(user, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
        process.env.NEXT_PUBLIC_ROLE_ADMIN!,
        process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
      ]),
      body: (rowData: any) => (
        <a
          href={`/admin/ausentismos/${rowData.Id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          <i className="pi pi-eye text-xl"></i>
        </a>
      ),
    },
  ];

  return (
    <MedinttGuard
      data={user}
      validator={(u) =>
        checkPermissions(u, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
          process.env.NEXT_PUBLIC_ROLE_ADMIN!,
          process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
        ])
      }
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Ausentismos</h1>

        {/* Filters */}
        <div className="mb-4 flex gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Rango de Fechas</label>
            <Calendar
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.value as Date[] | null);
                setMesReferencia(null); // Clear other filter
              }}
              selectionMode="range"
              dateFormat="dd/mm/yy"
              placeholder="Seleccionar rango"
              showIcon
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Mes de Referencia</label>
            <Calendar
              value={mesReferencia}
              onChange={(e) => {
                setMesReferencia(e.value as Date | null);
                setDateRange(null); // Clear other filter
              }}
              view="month"
              dateFormat="mm/yy"
              placeholder="Seleccionar mes"
              showIcon
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setDateRange(null);
                setMesReferencia(null);
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        <MedinttTable
          data={ausentismos || []}
          columns={columns}
          loading={isLoading}
          enableGlobalFilter={true}
          globalFilterFields={[
            "paciente.Apellido",
            "paciente.Nombre",
            "paciente.NroDocumento",
            "Diagnostico",
            "prestataria.Nombre",
          ]}
        />
      </div>
    </MedinttGuard>
  );
}
