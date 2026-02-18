"use client";

import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/services/permissions";
import { MedinttGuard, MedinttTable } from "@medintt/ui";
import { useAusentismos, usePrestatarias } from "@/hooks/useAusentismos";
import { formatDate } from "@/lib/date";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { AusentismosFilters } from "@/queries/ausentismos";

export default function AusentismosPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  const [mesReferencia, setMesReferencia] = useState<Date | null>(null);
  const [selectedPrestataria, setSelectedPrestataria] = useState<number | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  const { prestatarias } = usePrestatarias();

  // Reset page when filters change
  const handleFilterChange = (updater: () => void) => {
    updater();
    setPage(1);
  };

  // Build filters based on state
  const filters: AusentismosFilters = {
    page,
    limit,
  };

  if (dateRange && dateRange[0] && dateRange[1]) {
    filters.desde = dateRange[0].toISOString();
    filters.hasta = dateRange[1].toISOString();
  } else if (mesReferencia) {
    filters.mesReferencia = mesReferencia.toISOString();
  }

  if (selectedPrestataria) {
    filters.prestatariaId = selectedPrestataria;
  }

  const { ausentismos, meta, isLoading } = useAusentismos(filters);

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
      field: "Ausentismos_Categorias.Categoria",
      header: "Categoría",
      body: (rowData: any) => rowData.Ausentismos_Categorias?.Categoria || "-",
    },
    { field: "Diagnostico", header: "Diagnóstico" },
    {
      field: "Evolucion",
      header: "Evolución",
      body: (rowData: any) => (
        <div
          className="max-h-20 overflow-y-auto whitespace-pre-wrap text-sm"
          style={{ minWidth: "200px" }}
        >
          {rowData.Evolucion || "-"}
        </div>
      ),
    },
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

  const showPrestatariaFilter = checkPermissions(
    user,
    process.env.NEXT_PUBLIC_SELF_PROJECT!,
    [process.env.NEXT_PUBLIC_ROLE_ADMIN!],
  );

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
        <div className="mb-4 flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Rango de Fechas</label>
            <Calendar
              value={dateRange}
              onChange={(e) =>
                handleFilterChange(() => {
                  setDateRange(e.value as Date[] | null);
                  setMesReferencia(null);
                })
              }
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
              onChange={(e) =>
                handleFilterChange(() => {
                  setMesReferencia(e.value as Date | null);
                  setDateRange(null);
                })
              }
              view="month"
              dateFormat="mm/yy"
              placeholder="Seleccionar mes"
              showIcon
            />
          </div>

          {showPrestatariaFilter && (
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Prestataria</label>
              <Dropdown
                value={selectedPrestataria}
                onChange={(e) =>
                  handleFilterChange(() => setSelectedPrestataria(e.value))
                }
                options={prestatarias || []}
                optionLabel="Nombre"
                optionValue="Id"
                placeholder="Seleccionar Empresa"
                showClear
                filter
                className="w-64"
              />
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={() =>
                handleFilterChange(() => {
                  setDateRange(null);
                  setMesReferencia(null);
                  setSelectedPrestataria(null);
                })
              }
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
          lazy
          paginator
          first={(page - 1) * limit}
          rows={limit}
          totalRecords={meta?.total || 0}
          onPage={(e: any) => setPage((e.page || 0) + 1)}
          rowsPerPageOptions={[10]}
        />
      </div>
    </MedinttGuard>
  );
}
