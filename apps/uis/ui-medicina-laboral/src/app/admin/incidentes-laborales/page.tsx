"use client";

import {
  useIncidentesLaborales,
  IncidentesFilters,
} from "@/hooks/useIncidentesLaborales";
import { MedinttGuard, MedinttTable } from "@medintt/ui";
import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/services/permissions";
import { formatDate } from "@/lib/date";
import { ProgressSpinner } from "primereact/progressspinner";
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { usePrestatarias } from "@/hooks/useAusentismos";

export default function IncidentesLaboralesPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedPrestataria, setSelectedPrestataria] = useState<number | null>(
    null,
  );
  const [exporting, setExporting] = useState(false);

  const { prestatarias } = usePrestatarias();

  // Reset page when filters change
  const handleFilterChange = (updater: () => void) => {
    updater();
    setPage(1);
  };

  const filters: IncidentesFilters = {
    page,
    limit,
    search,
    prestatariaId: selectedPrestataria || undefined,
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const exportFilters = { ...filters };
      delete exportFilters.page;
      delete exportFilters.limit;

      await import("@/hooks/useIncidentesLaborales").then((mod) =>
        mod.exportIncidentesExcel(exportFilters),
      );
    } catch (error) {
      console.error("Failed to export excel", error);
    } finally {
      setExporting(false);
    }
  };

  const { incidentes, meta, isLoading } = useIncidentesLaborales(filters);

  const projectCode =
    process.env.MED_LAB_PROJECT ||
    process.env.NEXT_PUBLIC_SELF_PROJECT ||
    "MED_LAB_PROJECT";
  const requiredRoles = [
    process.env.NEXT_PUBLIC_ROLE_ADMIN!,
    process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
  ];

  const isAdmin = checkPermissions(
    user,
    process.env.NEXT_PUBLIC_SELF_PROJECT || "MED_LAB_PROJECT",
    [process.env.NEXT_PUBLIC_ROLE_ADMIN || "ADMIN"],
  );

  const columns = [
    ...(isAdmin || user?.isSuperAdmin
      ? [
          {
            field: "Prestataria.Nombre",
            header: "Prestataria",
            sortable: true,
            body: (rowData: any) => rowData.Prestataria?.Nombre || "-",
          },
        ]
      : []),
    {
      field: "Fecha",
      header: "Fecha",
      body: (rowData: any) => formatDate(rowData.Fecha),
      sortable: true,
    },
    {
      field: "Clase",
      header: "Clase",
      sortable: true,
    },
    {
      field: "Paciente",
      header: "Paciente",
      sortable: true,
    },
    {
      field: "DNI",
      header: "DNI",
      sortable: true,
    },
    {
      field: "Profesional",
      header: "Profesional",
      sortable: true,
    },
    {
      field: "Notas",
      header: "Notas",
      sortable: true,
      body: (rowData: any) => (
        <div className="whitespace-pre-wrap max-h-20 overflow-y-auto">
          {rowData.Notas}
        </div>
      ),
    },
  ];

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <MedinttGuard
      data={user}
      validator={(u) => checkPermissions(u, projectCode, requiredRoles)}
    >
      <div className="card text-2xl font-bold mb-4">
        <h1 className="mb-4">Incidentes Laborales</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-end font-normal text-base">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="search" className="font-semibold text-sm">
              Buscar
            </label>
            <div className="p-inputgroup">
              <InputText
                id="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paciente, DNI, Profesional, Clase, Notas..."
              />
              <Button icon="pi pi-search" onClick={handleSearch} />
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-col gap-2 w-full md:w-64">
              <label htmlFor="prestataria" className="font-semibold text-sm">
                Empresa (Prestataria)
              </label>
              <Dropdown
                id="prestataria"
                value={selectedPrestataria}
                onChange={(e) =>
                  handleFilterChange(() => setSelectedPrestataria(e.value))
                }
                options={prestatarias}
                optionLabel="Nombre"
                optionValue="Id"
                placeholder="Seleccionar Empresa"
                showClear
                filter
                className="w-full"
              />
            </div>
          )}

          <div className="flex flex-col justify-end">
            <div className="flex items-end gap-2">
              <Button
                label="Limpiar Filtros"
                icon="pi pi-filter-slash"
                outlined
                size="small"
                onClick={() =>
                  handleFilterChange(() => {
                    setSearch("");
                    setSearchInput("");
                    setSelectedPrestataria(null);
                  })
                }
              />
              {(isAdmin || user?.isSuperAdmin) && (
                <Button
                  icon="pi pi-file-excel"
                  severity="success"
                  outlined
                  rounded
                  size="small"
                  tooltip="Exportar Excel"
                  tooltipOptions={{ position: "bottom" }}
                  onClick={handleExport}
                  loading={exporting}
                />
              )}
            </div>
          </div>
        </div>

        <MedinttTable
          columns={columns}
          data={incidentes || []}
          emptyMessage="No hay incidentes laborales registrados."
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
