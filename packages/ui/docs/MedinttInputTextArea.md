# MedinttInputTextArea

`MedinttInputTextArea` es un componente wrapper que integra el **InputTextarea** de PrimeReact con **React Hook Form**.

Está diseñado para capturar entradas de texto de múltiples líneas, soportando características como el redimensionamiento automático (`autoResize`) y conteo de caracteres, manteniendo la gestión de estado y validaciones centralizada.

## Importación

```tsx
import { MedinttInputTextArea } from "@/components/MedinttInputTextArea";
```

## Props

El componente acepta todas las propiedades nativas de `InputTextareaProps` (de PrimeReact) excepto `name`, `value` y `onChange`.

Propiedades principales:

| Prop         | Tipo              | Requerido | Descripción                                                         |
| :----------- | :---------------- | :-------: | :------------------------------------------------------------------ |
| `name`       | `Path<T>`         |    Sí     | Nombre del campo en el formulario.                                  |
| `control`    | `Control<T>`      |    Sí     | Objeto de control de `react-hook-form`.                             |
| `label`      | `string`          |    No     | Etiqueta visible sobre el área de texto.                            |
| `rules`      | `RegisterOptions` |    No     | Reglas de validación (`required`, `maxLength`, `minLength`).        |
| `rows`       | `number`          |    No     | Número de filas visibles inicialmente. Por defecto suele ser 2 o 3. |
| `autoResize` | `boolean`         |    No     | Si es `true`, el área de texto crece verticalmente al escribir.     |
| `helpText`   | `string`          |    No     | Texto de ayuda debajo del input.                                    |

## Ejemplos de uso

### 1. Área de Texto Simple (Observaciones)

Un campo fijo para notas o comentarios adicionales.

```tsx
<MedinttInputTextArea
  name="observaciones"
  control={control}
  label="Observaciones Adicionales"
  rows={5}
  placeholder="Escriba aquí cualquier detalle relevante..."
/>
```

### 2. Auto-Resize (Descripciones Dinámicas)

Ideal para campos donde la longitud del contenido varía mucho, como descripciones de problemas o diagnósticos. El campo crece a medida que el usuario escribe.

```tsx
<MedinttInputTextArea
  name="descripcionProblema"
  control={control}
  label="Descripción del Problema"
  autoResize
  rows={3}
  rules={{ required: "La descripción es obligatoria" }}
/>
```

### 3. Validación de Longitud

Uso de `rules` para limitar la cantidad de caracteres y mostrar un mensaje de error si se excede.

```tsx
<MedinttInputTextArea
  name="resumen"
  control={control}
  label="Resumen Ejecutivo"
  helpText="Máximo 500 caracteres."
  rules={{
    maxLength: {
      value: 500,
      message: "El resumen no puede exceder los 500 caracteres",
    },
  }}
/>
```

## Comportamiento Visual

- **Consistencia:** Al igual que `MedinttInputText`, si hay un error de validación, el borde del área de texto se torna rojo y el mensaje de error reemplaza al `helpText`.

- **Ancho:** Por defecto, el componente está configurado con `w-full` (width: 100%) para ocupar todo el ancho de su contenedor padre.

## Dependencias

- `primereact`

- `react-hook-form`

- `tailwindcss`
