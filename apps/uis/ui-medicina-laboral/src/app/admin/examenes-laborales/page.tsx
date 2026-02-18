"use client";

import { useAuth } from "@/hooks/useAuth";
import { checkPermissions } from "@/services/permissions";
import { MedinttGuard, MedinttTable } from "@medintt/ui";
import { usePacientes } from "@/hooks/usePacientes";

import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { usePrestatarias } from "@/hooks/useAusentismos";
import { PacientesFilters } from "@/queries/pacientes";

export default function ExamenesLaboralesPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedPrestataria, setSelectedPrestataria] = useState<number | null>(
    null,
  );

  const { prestatarias } = usePrestatarias();

  const filters: PacientesFilters = {
    page,
    limit,
    search,
    prestatariaId: selectedPrestataria || undefined,
    includeExamsCount: true, // Specific to this page
  };

  const { pacientes, meta, isLoading } = usePacientes(filters);

  const patientsWithCompanies =
    pacientes?.map((p: any) => ({
      ...p,
      prestatariasString:
        p.prestatarias?.map((prep: any) => prep.Nombre).join(", ") || "",
    })) || [];

  const columns = [
    { field: "Apellido", header: "Apellido" },
    { field: "Nombre", header: "Nombre" },
    { field: "NroDocumento", header: "Nro Doc" },
    {
      field: "prestatariasString",
      header: "Empresa",
      hidden: !checkPermissions(user, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
        process.env.NEXT_PUBLIC_ROLE_ADMIN!,
      ]),
    },
    { field: "Email", header: "Email" },
    { field: "Cargo", header: "Cargo" },
    { field: "Puesto", header: "Puesto" },
    {
      field: "examenes",
      header: "Examenes Laborales",
      hidden: !checkPermissions(user, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
        process.env.NEXT_PUBLIC_ROLE_ADMIN!,
        process.env.NEXT_PUBLIC_ROLE_INTERLOCUTOR!,
      ]),
      body: (rowData: any) => {
        const hasExams = (rowData.examenesCount || 0) > 0;
        return (
          <a
            href={
              hasExams ? `/admin/examenes-laborales/${rowData.Id}` : undefined
            }
            className={`text-blue-600 hover:text-blue-800 ${
              !hasExams
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
            title={
              hasExams
                ? "Ver Examenes Laborales"
                : "No tiene examenes laborales"
            }
            aria-disabled={!hasExams}
          >
            <i className="pi pi-eye text-xl"></i>
          </a>
        );
      },
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

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setSelectedPrestataria(null);
    setPage(1);
  };

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
        <h1 className="text-2xl font-bold mb-4">Exámenes Laborales</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
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
                placeholder="Nombre, Apellido, DNI, Email..."
              />
              <Button icon="pi pi-search" onClick={handleSearch} />
            </div>
          </div>

          {checkPermissions(user, process.env.NEXT_PUBLIC_SELF_PROJECT!, [
            process.env.NEXT_PUBLIC_ROLE_ADMIN!,
          ]) && (
            <div className="flex flex-col gap-2 w-full md:w-64">
              <label htmlFor="prestataria" className="font-semibold text-sm">
                Empresa (Prestataria)
              </label>
              <Dropdown
                id="prestataria"
                value={selectedPrestataria}
                onChange={(e) => {
                  setSelectedPrestataria(e.value);
                  setPage(1);
                }}
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
            <Button
              label="Limpiar Filtros"
              icon="pi pi-filter-slash"
              outlined
              onClick={clearFilters}
            />
          </div>
        </div>

        <MedinttTable
          data={patientsWithCompanies}
          columns={columns}
          loading={isLoading}
          enableGlobalFilter={false} // Disabled client-side filter
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
