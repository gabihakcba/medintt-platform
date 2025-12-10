# MedinttCalendar

`MedinttCalendar` es un componente wrapper que integra el **Calendar** de PrimeReact con **React Hook Form**.

Facilita la captura de fechas y horas, asegurando que los objetos `Date` nativos de JavaScript se sincronicen correctamente con el estado del formulario. Soporta selección simple, rangos de fechas, formatos personalizados y selección de hora.

## Importación

```tsx
import { MedinttCalendar } from "@/components/MedinttCalendar";
```

## Props

El componente acepta todas las propiedades nativas de `CalendarProps` (de PrimeReact) excepto `name`, `value` y `onChange`.

Propiedades principales:

| Prop                  | Tipo                                | Requerido | Descripción                                      |
| :-------------------- | :---------------------------------- | :-------: | :----------------------------------------------- |
| `name`                | `Path<T>`                           |    Sí     | Nombre del campo en el formulario.               |
| `control`             | `Control<T>`                        |    Sí     | Objeto de control de `react-hook-form`.          |
| `label`               | `string`                            |    No     | Etiqueta visible sobre el input.                 |
| `rules`               | `RegisterOptions`                   |    No     | Reglas de validación (`required`, `min`, `max`). |
| `showIcon`            | `boolean`                           |    No     | Muestra un ícono de calendario dentro del input. |
| `showTime`            | `boolean`                           |    No     | Permite seleccionar hora además de la fecha.     |
| `hourFormat`          | `'12' \| '24'`                      |    No     | Formato de hora.                                 |
| `dateFormat`          | `string`                            |    No     | Formato visual de la fecha (ej: `'dd/mm/yy'`).   |
| `selectionMode`       | `'single' \| 'multiple' \| 'range'` |    No     | Modo de selección.                               |
| `minDate` / `maxDate` | `Date`                              |    No     | Restricciones de fechas seleccionables.          |

## Ejemplos de uso

### 1. Fecha de Nacimiento (Solo Fecha)

Configuración estándar para seleccionar una fecha.

```tsx
<MedinttCalendar
  name="fechaNacimiento"
  control={control}
  label="Fecha de Nacimiento"
  showIcon
  dateFormat="dd/mm/yy"
  maxDate={new Date()} // No permitir fechas futuras
  rules={{ required: "La fecha es obligatoria" }}
/>
```

### 2. Fecha y Hora (Turnos/Citas)

Habilita la selección de horas y minutos, ideal para agendar citas médicas o eventos.

```tsx
<MedinttCalendar
  name="inicioTurno"
  control={control}
  label="Inicio del Turno"
  showIcon
  showTime
  hourFormat="24"
  stepMinute={15} // Intervalos de 15 minutos
  rules={{ required: "Debe seleccionar fecha y hora" }}
/>
```

### 3. Rango de Fechas (Filtros/Reportes)

Permite seleccionar un periodo (fecha inicio y fecha fin). Nota: En este modo, el valor retornado es un array de objetos `Date` (`[Date, Date]`).

```tsx
<MedinttCalendar
  name="periodoVacaciones"
  control={control}
  label="Periodo de Vacaciones"
  selectionMode="range"
  placeholder="Seleccione fecha inicio y fin"
  readOnlyInput // Obliga a usar el popup para elegir
/>
```

## Consideraciones Técnicas

- **Tipo de Dato:** Este componente trabaja y retorna objetos `Date` de JavaScript, no strings.
  - Al enviar los datos al backend, asegúrate de formatearlos (ej. a ISO string `YYYY-MM-DD`) si tu API espera texto.

- `Localización:` Para que los nombres de los días y meses aparezcan en español, debes haber configurado el `locale` de PrimeReact (usualmente `addLocale('es', ...)`) en la configuración global de tu aplicación (`_app.tsx` o `layout.tsx`).

- **Validación Manual:** Si usas `minDate` o `maxDate`, PrimeReact deshabilitará visualmente las fechas en el calendario, pero se recomienda añadir validación en `rules` por seguridad.

## Dependencias

- `primereact`

- `react-hook-form`

- `primeicons`

- `tailwindcss`
