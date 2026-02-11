"use client";

import React, { useState, ReactNode } from "react";
import {
  DataTable,
  DataTableFilterMeta,
  DataTableProps,
  DataTableValue,
} from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { FilterMatchMode } from "primereact/api";
import { twMerge } from "tailwind-merge";
import { Calendar } from "primereact/calendar";

export interface MedinttColumnConfig<T = any> extends Omit<
  ColumnProps,
  "field" | "body"
> {
  header: string;
  field?: string;
  body?: (data: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DateFilterConfig {
  field: string;
  label?: string;
  mode?: "single" | "range";
  placeholder?: string;
}

interface MedinttTableProps<T extends DataTableValue> extends Omit<
  DataTableProps<T[]>,
  "value" | "filters" | "header"
> {
  data: T[];
  columns: MedinttColumnConfig<T>[];

  enableGlobalFilter?: boolean;
  globalFilterFields?: string[];
  dateFilter?: DateFilterConfig;
  headerActions?: ReactNode;

  actions?: (row: T) => ReactNode;
  actionsHeader?: string;

  loading?: boolean;
  emptyMessage?: string;
  title?: string;
}

export const MedinttTable = <T extends object>({
  data,
  columns,
  enableGlobalFilter = false,
  globalFilterFields,
  dateFilter,
  headerActions,
  actions,
  actionsHeader = "Acciones",
  loading = false,
  emptyMessage = "No se encontraron registros",
  title,
  paginator = true,
  rows = 10,
  rowsPerPageOptions = [5, 10, 20, 50],
  virtualScrollerOptions,
  className,
  ...props
}: MedinttTableProps<T>) => {
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ...(dateFilter
      ? {
          [dateFilter.field]: {
            value: null,
            matchMode:
              dateFilter.mode === "range"
                ? FilterMatchMode.BETWEEN
                : FilterMatchMode.DATE_IS,
          },
        }
      : {}),
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onDateFilterChange = (val: any) => {
    const _filters = { ...filters };
    if (dateFilter) {
      _filters[dateFilter.field] = {
        ...(_filters[dateFilter.field] as any),
        value: val,
      };
    }
    setFilters(_filters);
  };

  const renderHeader = () => {
    if (!title && !enableGlobalFilter && !dateFilter && !headerActions)
      return null;

    return (
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xl font-bold text-text-main">{title}</div>

        <div className="flex flex-row sm:flex-row gap-2 w-full md:w-auto items-center flex-1 justify-end">
          {dateFilter && (
            <Calendar
              value={(filters[dateFilter.field] as any)?.value}
              onChange={(e) => onDateFilterChange(e.value)}
              selectionMode={dateFilter.mode === "range" ? "range" : "single"}
              placeholder={dateFilter.placeholder || "Filtrar por fecha"}
              showIcon
              className="w-full md:w-48"
              showButtonBar
              onClearButtonClick={() => onDateFilterChange(null)}
            />
          )}

          {enableGlobalFilter && (
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Buscar..."
                className="w-full p-2 pl-10"
              />
            </IconField>
          )}
          {headerActions}
        </div>
      </div>
    );
  };

  const defaultVirtualOptions = virtualScrollerOptions
    ? { itemSize: 20, ...virtualScrollerOptions }
    : undefined;

  return (
    <div
      className={twMerge(
        "card rounded-lg shadow-sm bg-surface-card",
        className,
      )}
    >
      <DataTable
        value={data}
        loading={loading}
        header={renderHeader()}
        filters={filters}
        globalFilterFields={globalFilterFields}
        emptyMessage={emptyMessage}
        paginator={paginator}
        rows={rows}
        rowsPerPageOptions={rowsPerPageOptions}
        virtualScrollerOptions={defaultVirtualOptions}
        className="p-datatable-sm"
        stripedRows
        removableSort
        scrollable
        scrollHeight="flex"
        {...(props as any)}
      >
        {columns.map((col, index) => (
          <Column
            key={`${col.field || index}`}
            field={col.field}
            header={col.header}
            body={col.body}
            sortable={col.sortable ?? true}
            style={col.style}
            className={col.className}
            dataType={dateFilter?.field === col.field ? "date" : undefined}
          />
        ))}

        {actions && (
          <Column
            body={actions}
            header={actionsHeader}
            alignFrozen="right"
            frozen={false}
            style={{ width: "auto", minWidth: "8rem", textAlign: "center" }}
          />
        )}
      </DataTable>
    </div>
  );
};
