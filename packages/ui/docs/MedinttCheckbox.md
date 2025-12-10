# MedinttCheckbox

`MedinttCheckbox` es un componente wrapper que integra el **Checkbox** de PrimeReact con **React Hook Form**.

Está diseñado para gestionar valores booleanos (true/false), ideal para confirmaciones, aceptaciones de términos o configuraciones de "activado/desactivado". Gestiona automáticamente la alineación entre el cuadro de selección y su etiqueta.

## Importación

```tsx
import { MedinttCheckbox } from "@/components/MedinttCheckbox";
```

## Props

El componente acepta todas las propiedades nativas de `CheckboxProps` (de PrimeReact) excepto `name`, `value`, `onChange` y `checked`.

Propiedades principales:

| Prop       | Tipo              | Requerido | Descripción                                                                                |
| :--------- | :---------------- | :-------: | :----------------------------------------------------------------------------------------- |
| `name`     | `Path<T>`         |    Sí     | Nombre del campo en el formulario.                                                         |
| `control`  | `Control<T>`      |    Sí     | Objeto de control de `react-hook-form`.                                                    |
| `label`    | `string`          |    No     | Texto que aparece al lado del checkbox.                                                    |
| `rules`    | `RegisterOptions` |    No     | Reglas de validación (usualmente `required: true` para términos).                          |
| `inputId`  | `string`          |    No     | ID para vincular la etiqueta con el input (accesibilidad). Si no se provee, se genera uno. |
| `helpText` | `string`          |    No     | Texto de ayuda o aclaración debajo del componente.                                         |

## Ejemplos de uso

### 1. Opción Simple (Configuración)

Un interruptor simple para activar o desactivar una funcionalidad. El valor guardado será `true` o `false`.

```tsx
<MedinttCheckbox
  name="recibirNotificaciones"
  control={control}
  label="Suscribirse al boletín de noticias"
/>
```

### 2. Validación Requerida (Términos y Condiciones)

Para casos **donde** el usuario debe marcar la casilla para continuar, utilizamos la regla `required`.

```tsx
<MedinttCheckbox
  name="aceptaTerminos"
  control={control}
  label="He leído y acepto los términos y condiciones"
  rules={{
    required: "Debe aceptar los términos para continuar",
  }}
/>
```

### 3. Estado Inicial

Para que el checkbox aparezca marcado por defecto, se debe establecer el valor en el `defaultValues` del hook `useForm`, no en el componente directamente.

```tsx
const { control } = useForm({
  defaultValues: {
    usuarioActivo: true, // El checkbox iniciará marcado
  },
});

// ... en el JSX:
<MedinttCheckbox
  name="usuarioActivo"
  control={control}
  label="Usuario Activo"
/>;
```

## sComportamiento Visual

- **Alineación:** El componente renderiza un contenedor flex (`flex items-center`) para asegurar que la cajita del checkbox y el texto del `label` estén perfectamente alineados verticalmente.

- **Error:** Si hay un error de validación (ej. no aceptar términos obligatorios), el borde del checkbox se pone rojo y el mensaje de error aparece debajo de la etiqueta.

- `Interacción:` Al hacer clic en el texto del `label`, el checkbox también cambia de estado (gracias a la vinculación `htmlFor` e `inputId`).

## Dependencias

- `primereact`

- `react-hook-form`

- `tailwindcss`
