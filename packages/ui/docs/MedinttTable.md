# MedinttTable

Wrapper avanzado de `DataTable` de PrimeReact que incluye:

- Filtro global inteligente.
- Filtro por rango de fechas integrado en el header.
- Virtual Scroller pre-configurado.
- Renderizado de columnas anidadas (`user.name`).

## Props Principales

| Propiedad            | Tipo                    | Descripción                                                                                                      |
| :------------------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `data`               | `T[]`                   | Array de objetos a mostrar. **Nota:** Si usas filtro de fechas, las fechas deben ser objetos `Date`, no strings. |
| `columns`            | `MedinttColumnConfig[]` | Configuración de las columnas.                                                                                   |
| `actions`            | `(row) => ReactNode`    | Función que retorna botones para la columna final de acciones.                                                   |
| `enableGlobalFilter` | `boolean`               | Activa el buscador general.                                                                                      |
| `dateFilter`         | `object`                | Configuración del filtro de fecha (`{ field, mode }`).                                                           |

## Ejemplo Mínimo

```tsx
<MedinttTable
  data={users}
  columns={[
    { header: "ID", field: "id" },
    { header: "Nombre", field: "name" },
  ]}
/>
```

## Ejemplo Completo (Filtros y Acciones)

```tsx
<MedinttTable
  title="Listado de Pacientes"
  data={pacientes} // Asegurarse que fechaIngreso sea new Date()
  // 1. Columnas Anidadas y Custom Body
  columns={[
    { header: "Nombre", field: "persona.nombre", sortable: true },
    { header: "Estado", body: (row) => <Tag value={row.estado} /> },
  ]}
  // 2. Filtros
  enableGlobalFilter
  globalFilterFields={["persona.nombre", "dni"]}
  dateFilter={{
    field: "fechaIngreso",
    mode: "range",
    placeholder: "Filtrar por fecha",
  }}
  // 3. Acciones con acceso a la fila
  actions={(row) => (
    <div className="flex gap-2">
      <MedinttButton icon="pi pi-pencil" onClick={() => edit(row.id)} />
    </div>
  )}
  // 4. Props de DataTable ({...props})
  // Puedes pasar cualquier prop nativa de PrimeReact DataTable
  resizableColumns
  showGridlines
/>
```
