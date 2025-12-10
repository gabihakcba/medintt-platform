# MedinttDropdown

`MedinttDropdown` es un componente wrapper que integra el **Dropdown** de PrimeReact con **React Hook Form**.

Permite al usuario seleccionar un único valor de una lista de opciones. Es altamente flexible, soportando arrays de strings, arrays de objetos, filtrado (búsqueda), plantillas personalizadas y manejo de estados de carga.

## Importación

```tsx
import { MedinttDropdown } from "@/components/MedinttDropdown";
```

## Props

El componente acepta todas las propiedades nativas de `DropdownProps` (de PrimeReact) excepto `name`, `value` y `onChange`.

Propiedades principales:

| Prop          | Tipo         | Requerido | Descripción                                                                                          |
| :------------ | :----------- | :-------: | :--------------------------------------------------------------------------------------------------- |
| `name`        | `Path<T>`    |    Sí     | Nombre del campo en el formulario.                                                                   |
| `control`     | `Control<T>` |    Sí     | Objeto de control de `react-hook-form`.                                                              |
| `options`     | `any[]`      |    Sí     | Array de datos a mostrar.                                                                            |
| `label`       | `string`     |    No     | Etiqueta visible sobre el input.                                                                     |
| `optionLabel` | `string`     |    No     | Nombre de la propiedad del objeto a mostrar como texto (ej: `'nombre'`).                             |
| `optionValue` | `string`     |    No     | Nombre de la propiedad a guardar como valor (ej: `'id'`). Si se omite, se guarda el objeto completo. |
| `placeholder` | `string`     |    No     | Texto a mostrar cuando no hay selección.                                                             |
| `filter`      | `boolean`    |    No     | Habilita una barra de búsqueda dentro del desplegable.                                               |
| `showClear`   | `boolean`    |    No     | Muestra una `X` para limpiar la selección.                                                           |
| `loading`     | `boolean`    |    No     | Muestra un indicador de carga (útil para datos asíncronos).                                          |

## Ejemplos de uso

### 1. Selección Simple (Guardando ID)

El caso de uso más común: mostrar un nombre pero guardar un ID en la base de datos.

```tsx
const ciudades = [
  { name: "Córdoba", code: "CBA" },
  { name: "Buenos Aires", code: "BA" },
  { name: "Rosario", code: "ROS" },
];

<MedinttDropdown
  name="ciudadId"
  control={control}
  label="Ciudad"
  options={ciudades}
  optionLabel="name" // Muestra 'Córdoba'
  optionValue="code" // Guarda 'CBA'
  placeholder="Seleccione una ciudad"
  rules={{ required: "Seleccione una ciudad" }}
/>;
```

### 2. Selección de Objeto Completo

A veces necesitamos guardar el objeto entero en el formulario, no solo el ID. Para esto, simplemente no definimos la prop `optionValue`.

```tsx
const ciudades = [
  { name: "Córdoba", code: "CBA" },
  { name: "Buenos Aires", code: "BA" },
  { name: "Rosario", code: "ROS" },
];

<MedinttDropdown
  name="ciudadId"
  control={control}
  label="Ciudad"
  options={ciudades}
  optionLabel="name" // Muestra 'Córdoba'
  optionValue="code" // Guarda 'CBA'
  placeholder="Seleccione una ciudad"
  rules={{ required: "Seleccione una ciudad" }}
/>;
```

### 3. Con Buscador (Filtrado)

Ideal para listas largas (ej. lista de obras sociales o medicamentos).

```tsx
<MedinttDropdown
  name="obraSocial"
  control={control}
  label="Obra Social"
  options={obrasSociales}
  optionLabel="razonSocial"
  optionValue="id"
  filter // Habilita la búsqueda
  showClear // Permite borrar la selección
  filterBy="razonSocial,codigo" // (Opcional) Campos por los que buscar
  placeholder="Busque su obra social..."
/>
```

### 4. Estado de Carga (Async)

Si las opciones vienen de una API, podemos usar la prop `loading` para dar feedback visual.

```tsx
<MedinttDropdown
  name="medicoDerivante"
  control={control}
  label="Médico Derivante"
  options={medicos} // Data de la API
  loading={isLoadingMedicos} // Booleano de estado de carga
  optionLabel="apellido"
/>
```

## Notas Técnicas

- **OptionLabel vs Template:** `optionLabel` es para texto simple. Si necesitas mostrar algo complejo en la lista (como "Nombre - DNI"), puedes usar la prop `itemTemplate` de PrimeReact, o pre-procesar tus datos para crear una propiedad compuesta antes de pasarlos a `options`.

- **Reset:** Si cambias las `options` dinámicamente (ej. seleccionas una Provincia y cargan las Ciudades), recuerda que debes manejar el reseteo del valor del dropdown dependiente manualmente usando `setValue` de react-hook-form, ya que el componente no sabe automáticamente que su valor anterior es inválido para la nueva lista.

## Dependencias

- `primereact`

- `react-hook-form`

- `tailwindcss`
