# MedinttSidebar

`MedinttSidebar` es un componente wrapper que integra el **Sidebar** de PrimeReact.

Su propósito es estandarizar los paneles deslizantes de la aplicación, asegurando un estilo consistente (bordes, sombras, anchos predefinidos con Tailwind) y simplificando la inclusión de encabezados y pies de página. Es ideal para formularios de "creación rápida", filtros avanzados o visualización de detalles sin salir de la pantalla actual.

## Importación

```tsx
import { MedinttSidebar } from "@/components/MedinttSidebar";
```

## Props

El componente acepta todas las propiedades nativas de `SidebarProps` (de PrimeReact).

Propiedades destacadas y personalizadas:

| Prop         | Tipo                                     | Requerido | Descripción                                                                                     |
| :----------- | :--------------------------------------- | :-------: | :---------------------------------------------------------------------------------------------- |
| `visible`    | `boolean`                                |    Sí     | Controla si el sidebar está abierto o cerrado.                                                  |
| `onHide`     | `() => void`                             |    Sí     | Función que se ejecuta al intentar cerrar (clic fuera o en la X).                               |
| `title`      | `string`                                 |    No     | Texto para el encabezado estándar. Si se usa, no hace falta crear un template de header manual. |
| `position`   | `'left' \| 'right' \| 'top' \| 'bottom'` |    No     | Posición de aparición. Default: `'right'`.                                                      |
| `className`  | `string`                                 |    No     | Clases para el contenedor del panel.                                                            |
| `fullScreen` | `boolean`                                |    No     | Si ocupa toda la pantalla.                                                                      |
| `footer`     | `ReactNode`                              |    No     | Contenido fijo al final del sidebar (ideal para botones de acción `"Guardar/Cancelar"`).        |

## Ejemplos de uso

### 1. Panel de Filtros (Uso Básico)

Un sidebar derecho estándar para contener filtros de búsqueda avanzados.

```tsx
const [visible, setVisible] = useState(false);

return (
  <>
    <Button
      label="Filtros"
      icon="pi pi-filter"
      onClick={() => setVisible(true)}
    />

    <MedinttSidebar
      visible={visible}
      onHide={() => setVisible(false)}
      title="Filtros de Búsqueda"
      position="right"
      className="w-full md:w-20rem" // Responsive: ancho completo en móvil, fijo en desktop
    >
      <div className="flex flex-col gap-4">
        {/* Aquí irían los inputs de filtro */}
        <p>Opciones de filtrado...</p>
      </div>
    </MedinttSidebar>
  </>
);
```

### 2. Formulario en Sidebar (Creación Rápida)

Un patrón común en MEDINTT: abrir un sidebar para crear o editar una entidad rápida sin navegar a otra página. Se utiliza la prop `footer` para los botones de acción.

```tsx
<MedinttSidebar
  visible={showForm}
  onHide={() => setShowForm(false)}
  title="Nuevo Paciente"
  className="w-full md:w-30rem" // Un poco más ancho para formularios
  footer={
    <div className="flex justify-end gap-2">
      <Button
        label="Cancelar"
        className="p-button-text"
        onClick={() => setShowForm(false)}
      />
      <Button label="Guardar" onClick={handleSubmit(onSubmit)} />
    </div>
  }
>
  {/* Contenido del formulario usando los componentes Medintt */}
  <form className="flex flex-col gap-4">
    <MedinttInputText name="nombre" control={control} label="Nombre" />
    <MedinttInputText name="apellido" control={control} label="Apellido" />
    <MedinttCalendar
      name="nacimiento"
      control={control}
      label="Fecha Nacimiento"
    />
  </form>
</MedinttSidebar>
```

### 3. Menú de Navegación (Izquierda)

Uso del sidebar a la izquierda para menús en dispositivos móviles.

```tsx
<MedinttSidebar
  visible={menuVisible}
  onHide={() => setMenuVisible(false)}
  position="left"
  title="Menú Principal"
>
  <nav>
    <ul className="list-none p-0 m-0">
      <li className="p-3 hover:bg-gray-100 cursor-pointer">Inicio</li>
      <li className="p-3 hover:bg-gray-100 cursor-pointer">Pacientes</li>
      <li className="p-3 hover:bg-gray-100 cursor-pointer">Turnos</li>
    </ul>
  </nav>
</MedinttSidebar>
```

## Estilos y Comportamiento

- `Ancho por Defecto:` PrimeReact trae un ancho por defecto. Se recomienda fuertemente usar clases de Tailwind en la prop `className` para controlar el ancho (ej: `w-full md:w-30rem`) para asegurar una buena experiencia móvil.

- `Scroll:` El contenido interno del sidebar tiene scroll automático si el contenido excede la altura de la pantalla (`overflow-y-auto`), mientras que el `header` y el `footer` permanecen fijos si están configurados correctamente en la estructura del wrapper.

- `Overlay:` Por defecto es modal (oscurece el fondo). Se puede cambiar con la prop `modal={false}` si se requiere interactuar con el fondo.

## Dependencias

- `primereact`

- `react-hook-form`

- `tailwindcss`
