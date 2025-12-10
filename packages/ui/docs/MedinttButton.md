# MedinttButton

Un componente de botón estandarizado que envuelve al `Button` de PrimeReact con estilos predeterminados para mantener la consistencia visual en la aplicación.

## Características

- **Estilo por defecto:** Viene configurado como `outlined` y tamaño `small` por defecto.
- **Iconos:** La posición del icono por defecto es a la derecha (`iconPos="right"`).
- **Tooltips Mejorados:** Configura automáticamente el tooltip para que se renderice en el `body` (evitando problemas de `overflow` en contenedores pequeños) y se posicione arriba.
- **Merge de Clases:** Utiliza `tailwind-merge` para permitirte agregar clases personalizadas sin romper los estilos base.

## Props

Este componente acepta **todas** las propiedades nativas de `Button` de PrimeReact (como `onClick`, `loading`, `disabled`, `severity`, etc.).

Además, define o sobrescribe los siguientes valores por defecto:

| Propiedad  | Tipo                                     | Default     | Descripción                                   |
| :--------- | :--------------------------------------- | :---------- | :-------------------------------------------- |
| `tooltip`  | `string`                                 | `undefined` | Texto que aparecerá al pasar el mouse.        |
| `size`     | `"small" \| "large"`                     | `"small"`   | Tamaño del botón.                             |
| `outlined` | `boolean`                                | `true`      | Si el botón tiene fondo transparente y borde. |
| `iconPos`  | `"left" \| "right" \| "top" \| "bottom"` | `"right"`   | Posición del icono respecto al texto.         |

## Ejemplos de Uso

### 1. Uso Mínimo (Estándar)

Este es el botón típico de la aplicación: pequeño, bordeado e icono a la derecha.

```tsx
import { MedinttButton } from "@medintt/ui";

<MedinttButton label="Guardar Cambios" icon="pi pi-check" onClick={save} />;
```

### 2. Botón de Acción Principal (Relleno)

```tsx
<MedinttButton
  label="Confirmar"
  icon="pi pi-check"
  outlined={false} // <--- Sobrescribimos el default
  severity="success" // Color verde de PrimeReact
/>
```

### 3. Botón con Tooltip y Loading

```tsx
<MedinttButton
  icon="pi pi-refresh"
  tooltip="Actualizar listado de usuarios"
  loading={isLoading} // Prop nativa de PrimeReact
  rounded // Botón redondo
  text // Variante tipo texto (sin borde)
  severity="info"
/>
```

### 4. Solo Icono

```tsx
<MedinttButton
  icon="pi pi-trash"
  severity="danger"
  tooltip="Eliminar"
  className="border-none hover:bg-red-50" // Clases Tailwind extra
/>
```

## Dependencias

- `primereact`

- `tailwindcss`
