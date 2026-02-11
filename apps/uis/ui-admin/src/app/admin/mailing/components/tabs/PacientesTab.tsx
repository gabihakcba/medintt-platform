import { useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { usePacientesEmails } from "@/hooks/useEmails";
import { PacienteEmail } from "@/queries/emails";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { toIsoString } from "@medintt/utils";
import { useProfesionales } from "@/hooks/useProfesionales";
import { Profesional } from "@/queries/profesionales";
import { MedinttButton } from "@medintt/ui";

interface PacientesTabProps {
  selectedPacientes: PacienteEmail[];
  setSelectedPacientes: (pacientes: PacienteEmail[]) => void;
}

export const PacientesTab = ({
  selectedPacientes,
  setSelectedPacientes,
}: PacientesTabProps) => {
  const [dates, setDates] = useState<Date[] | null>(null);
  const [selectedProfesional, setSelectedProfesional] =
    useState<Profesional | null>(null);

  const { profesionales, isLoading: isLoadingProfesionales } =
    useProfesionales();

  const [filtersParams, setFiltersParams] = useState<{
    desde?: string;
    hasta?: string;
    profesionalId?: number;
  }>({});

  const handleSearch = () => {
    const newFilters: any = {};

    if (Array.isArray(dates) && dates.length === 2 && dates[0] && dates[1]) {
      newFilters.desde = toIsoString(dates[0]);
      newFilters.hasta = toIsoString(dates[1]);
    }

    if (selectedProfesional) {
      newFilters.profesionalId = selectedProfesional.Id;
    }

    setFiltersParams(newFilters);
  };

  const handleClear = () => {
    setDates(null);
    setSelectedProfesional(null);
    setFiltersParams({});
  };

  const isSearchDisabled =
    !dates ||
    dates.length !== 2 ||
    !dates[0] ||
    !dates[1] ||
    !selectedProfesional;

  const { pacientes, isLoading } = usePacientesEmails(filtersParams);

  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const emailsBodyTemplate = (rowData: PacienteEmail) => {
    return (
      <div className="flex flex-wrap gap-2">
        {rowData.emails.map((email: string, index: number) => (
          <Tag key={index} value={email} severity="info" />
        ))}
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center gap-2">
        <div className="flex gap-2 w-full max-w-40rem align-items-center">
          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value as Date[])}
            selectionMode="range"
            placeholder="Rango de fechas"
            showIcon
            className="w-full"
          />
          <Dropdown
            value={selectedProfesional}
            onChange={(e) => setSelectedProfesional(e.value)}
            options={profesionales}
            optionLabel="Apellido"
            placeholder="Profesional"
            filter
            showClear
            className="w-full"
            loading={isLoadingProfesionales}
            itemTemplate={(option: Profesional) => (
              <div>
                {option.Apellido}, {option.Nombre}
              </div>
            )}
            valueTemplate={(option: Profesional) => {
              if (option) {
                return (
                  <div>
                    {option.Apellido}, {option.Nombre}
                  </div>
                );
              }
              return <span>Seleccionar Profesional</span>;
            }}
          />
          <MedinttButton
            label="Buscar"
            icon="pi pi-search"
            color="blue"
            onClick={handleSearch}
            disabled={isSearchDisabled}
          />
          <MedinttButton
            label="Limpiar"
            icon="pi pi-filter-slash"
            color="gray"
            onClick={handleClear}
            disabled={Object.keys(filtersParams).length === 0}
            className="p-button-outlined"
          />
        </div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar..."
          />
        </IconField>
      </div>
    );
  };

  const totalEmails = pacientes?.reduce(
    (acc, curr) => acc + curr.emails.length,
    0,
  );
  const selectedEmailsCount = selectedPacientes.reduce(
    (acc, curr) => acc + curr.emails.length,
    0,
  );

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">
        Selección de Pacientes ({selectedEmailsCount}/{totalEmails || 0})
      </h3>

      <div className="card">
        <DataTable
          value={pacientes}
          selection={selectedPacientes}
          onSelectionChange={(e) => setSelectedPacientes(e.value)}
          loading={isLoading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          selectionMode="checkbox"
          dataKey="Id"
          emptyMessage="No se encontraron pacientes"
          filters={filters}
          globalFilterFields={["Nombre", "Apellido", "NroDocumento", "emails"]}
          header={renderHeader()}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            field="Id"
            header="ID"
            sortable
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="Nombre"
            header="Nombre"
            sortable
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="Apellido"
            header="Apellido"
            sortable
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="NroDocumento"
            header="DNI"
            sortable
            style={{ width: "15%" }}
          ></Column>
          <Column
            header="Emails"
            body={emailsBodyTemplate}
            style={{ width: "35%" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};
