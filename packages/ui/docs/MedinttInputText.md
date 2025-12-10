# MedinttInputText

`MedinttInputText` es un componente wrapper reutilizable que integra el **InputText** de PrimeReact con la librería **React Hook Form**.

Su objetivo es estandarizar la entrada de texto en la aplicación, manejando automáticamente:

- El registro del campo en el formulario (`Controller`).
- La visualización de etiquetas (`labels`).
- Los estados de error y validación visual.
- Mensajes de ayuda y mensajes de error.
- Estilos consistentes con Tailwind CSS.

## Importación

```tsx
import { MedinttInputText } from "@/components/MedinttInputText"; // Ajustar ruta según estructura
```

## Props

El componente acepta todas las propiedades nativas de `InputTextProps` (de PrimeReact) excepto `name`, `value` y `onChange`, ya que estas son manejadas internamente por el `Controller`.

Además, incluye las siguientes propiedades específicas:

| Prop                 | Tipo              | Requerido | Descripción                                                                                |
| :------------------- | :---------------- | :-------: | :----------------------------------------------------------------------------------------- |
| `name`               | `Path<T>`         |    Sí     | El nombre del campo registrado en el formulario (debe coincidir con la interfaz de datos). |
| `control`            | `Control<T>`      |    Sí     | El objeto `control` retornado por `useForm`.                                               |
| `label`              | `string`          |    No     | Etiqueta visible sobre el input. Cambia de color si hay error.                             |
| `rules`              | `RegisterOptions` |    No     | Reglas de validación de React Hook Form (`required`, `minLength`, `pattern`, etc.).        |
| `helpText`           | `string`          |    No     | Texto de ayuda que aparece debajo del input cuando no hay errores.                         |
| `containerClassName` | `string`          |    No     | Clases CSS adicionales para el contenedor `div` que envuelve `label` e `input`.            |
| `className`          | `string`          |    No     | Clases CSS adicionales para el componente `InputText` interno.                             |
| `keyfilter`          | `KeyFilterType`   |    No     | Propiedad de PrimeReact para restringir caracteres (ej.: `'int'`, `'num'`, `'email'`).     |

## Ejemplos de Uso

### 1. Uso Básico

Formulario simple sin validaciones complejas.

```tsx
import { useForm } from "react-hook-form";
import { MedinttInputText } from "./MedinttInputText";

export const MyForm = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      nombreUsuario: "",
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <MedinttInputText
        name="nombreUsuario"
        control={control}
        label="Nombre de Usuario"
        placeholder="Ingresa tu nombre"
      />
    </form>
  );
};
```

### 2. Con Validaciones y Mensajes de Error

Uso de la prop `rules` para hacer el campo obligatorio y añadir validación de formato.

```tsx
<MedinttInputText
  name="email"
  control={control}
  label="Correo Electrónico"
  helpText="Utilizaremos este correo para enviarte la factura."
  keyfilter="email"
  rules={{
    required: "El correo es obligatorio",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Formato de correo inválido",
    },
  }}
/>
```

### 3. Estilizado Personalizado

Se pueden pasar clases de Tailwind para ajustar el ancho o el espaciado.

```tsx
<div className="flex gap-4">
  <MedinttInputText
    name="apellido"
    control={control}
    label="Apellido"
    containerClassName="w-1/2" // Controla el ancho del contenedor
  />
  <MedinttInputText
    name="nombre"
    control={control}
    label="Nombre"
    containerClassName="w-1/2"
  />
</div>
```

## Comportamiento Visual

1. Estado Normal: Muestra el label (si existe), el input y el helpText (si existe).

2. Estado de Error (invalid):


    * El label se vuelve rojo (text-red-500).

    * El borde del input se vuelve rojo (p-invalid).

    * Aparece un ícono de exclamación dentro del input a la derecha.

    * El helpText es reemplazado por el mensaje de error definido en rules.

## Dependencias

- primereact

- react-hook-form

- primeicons (para el ícono de error)

- tailwindcss (para utilidades de diseño)
