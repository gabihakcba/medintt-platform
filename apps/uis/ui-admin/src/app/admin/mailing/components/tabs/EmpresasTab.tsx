import { useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useEmpresasEmails } from "@/hooks/useEmails";
import { EmpresaEmail } from "@/queries/emails";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

interface EmpresasTabProps {
  selectedEmpresas: EmpresaEmail[];
  setSelectedEmpresas: (empresas: EmpresaEmail[]) => void;
}

export const EmpresasTab = ({
  selectedEmpresas,
  setSelectedEmpresas,
}: EmpresasTabProps) => {
  const { empresas, isLoading } = useEmpresasEmails();
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

  const emailsBodyTemplate = (rowData: EmpresaEmail) => {
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
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar por nombre o email..."
          />
        </IconField>
      </div>
    );
  };

  const totalEmails = empresas?.reduce(
    (acc, curr) => acc + curr.emails.length,
    0,
  );
  const selectedEmailsCount = selectedEmpresas.reduce(
    (acc, curr) => acc + curr.emails.length,
    0,
  );

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">
        Selección de Empresas ({selectedEmailsCount}/{totalEmails || 0})
      </h3>
      <div className="card">
        <DataTable
          value={empresas}
          selection={selectedEmpresas}
          onSelectionChange={(e) => setSelectedEmpresas(e.value)}
          loading={isLoading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          selectionMode="checkbox"
          dataKey="Id"
          emptyMessage="No se encontraron empresas"
          filters={filters}
          globalFilterFields={["Nombre", "emails"]}
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
            style={{ width: "30%" }}
          ></Column>
          <Column
            header="Emails"
            body={emailsBodyTemplate}
            style={{ width: "60%" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};
