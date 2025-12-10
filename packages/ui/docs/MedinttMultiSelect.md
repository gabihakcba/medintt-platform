# MedinttMultiSelect

`MedinttMultiSelect` es un componente wrapper que integra el **MultiSelect** de PrimeReact con **React Hook Form**.

Permite la selección múltiple de elementos de una lista desplegable. Soporta visualización por "chips" (etiquetas), filtrado, "seleccionar todo" y manejo flexible de los datos seleccionados (ids o objetos completos).

## Importación

```tsx
import { MedinttMultiSelect } from "@/components/MedinttMultiSelect";
```

## Props

El componente acepta todas las propiedades nativas de `MultiSelectProps` (de PrimeReact) excepto `name`, `value` y `onChange`.

Propiedades principales:

| Prop                | Tipo                | Requerido | Descripción                                                                                 |
| :------------------ | :------------------ | :-------: | :------------------------------------------------------------------------------------------ |
| `name`              | `Path<T>`           |    Sí     | Nombre del campo en el formulario.                                                          |
| `control`           | `Control<T>`        |    Sí     | Objeto de control de `react-hook-form`.                                                     |
| `options`           | `any[]`             |    Sí     | Array de datos a mostrar.                                                                   |
| `label`             | `string`            |    No     | Etiqueta visible sobre el input.                                                            |
| `optionLabel`       | `string`            |    No     | Propiedad del objeto a mostrar como texto (ej: `'nombre'`).                                 |
| `optionValue`       | `string`            |    No     | Propiedad a guardar como valor (ej: `'id'`). Si se omite, guarda el objeto.                 |
| `display`           | `'comma' \| 'chip'` |    No     | Modo de visualización de seleccionados. Default: `'comma'`.                                 |
| `filter`            | `boolean`           |    No     | Habilita barra de búsqueda.                                                                 |
| `maxSelectedLabels` | `number`            |    No     | Cuántas etiquetas mostrar antes de agruparlas (ej: `"3 items selected"`) en modo `'comma'`. |
| `selectionLimit`    | `number`            |    No     | Límite máximo de elementos seleccionables.                                                  |

## Ejemplos de uso

### 1. Selección de IDs (Etiquetas/Categorías)

El caso más común: guardar un array de IDs en la base de datos. Visualización estándar separada por comas.

```tsx
const categorias = [
  { label: "Cardiología", value: 1 },
  { label: "Pediatría", value: 2 },
  { label: "Neurología", value: 3 },
];

<MedinttMultiSelect
  name="especialidadesIds"
  control={control}
  label="Especialidades"
  options={categorias}
  // PrimeReact usa 'label' y 'value' por defecto si no especificamos optionLabel/Value
  placeholder="Seleccione especialidades"
  rules={{ required: "Debe seleccionar al menos una especialidad" }}
/>;
```

### 2. Modo "Chips" (Asignación de Usuarios/Roles)

Visualización moderna donde cada selección aparece como una pastilla ("chip") removible. Ideal para asignar permisos o usuarios a un grupo.

```tsx
<MedinttMultiSelect
  name="usuariosAsignados"
  control={control}
  label="Asignar Usuarios"
  options={usersList}
  optionLabel="username"
  optionValue="uuid"
  display="chip" // Muestra cada selección como una etiqueta individual
  filter
  placeholder="Buscar y agregar usuarios"
/>
```

### 3. Selección de Objetos Completos

Al igual que en el Dropdown, si omitimos `optionValue`, el formulario guardará un array de objetos completos.

```tsx
<MedinttMultiSelect
  name="equipos"
  control={control}
  label="Equipos Médicos"
  options={equiposDisponibles}
  optionLabel="modelo"
  display="chip"
  // El valor será: [{modelo: 'X', id: 1}, {modelo: 'Y', id: 2}]
/>
```

### 4. Con Límite de Selección

Restringir la cantidad de elementos que el usuario puede elegir.

```tsx
<MedinttMultiSelect
  name="top3Preferencias"
  control={control}
  label="Seleccione sus 3 preferencias principales"
  options={preferencias}
  optionLabel="nombre"
  selectionLimit={3}
  showSelectAll={false} // Ocultar "Seleccionar todo" si hay límite
/>
```

## Notas Técnicas

- **Tipo de Dato:** Este componente siempre retorna un **Array** (`[]`). Si no hay nada seleccionado, retornará un array vacío o `null` dependiendo de la configuración inicial, pero se recomienda inicializarlo como `[]` en el `defaultValues` del `useForm`.

- `Ancho:` El componente maneja el ancho completo (`w-full`) para adaptarse a contenedores responsivos.

- `Rendimiento:` Para listas muy grandes (miles de opciones), PrimeReact soporta `virtualScrollerOptions`. Puedes pasar esa prop a través de `MedinttMultiSelect` si es necesario optimizar el renderizado.

## Dependencias

- `primereact`

- `react-hook-form`

- `tailwindcss`
