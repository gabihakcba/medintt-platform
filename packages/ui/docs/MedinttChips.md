# MedinttChips

`MedinttChips` es un componente wrapper que integra el **Chips** de PrimeReact con **React Hook Form**.

Permite al usuario ingresar múltiples valores de texto libre en un solo campo. Cada valor ingresado se visualiza como una "ficha" o etiqueta removible. Es ideal para listas de correos, palabras clave, síntomas libres o etiquetas de categorización.

## Importación

```tsx
import { MedinttChips } from "@/components/MedinttChips";
```

## Props

El componente acepta todas las propiedades nativas de `ChipsProps` (de PrimeReact) excepto `name`, `value` y `onChange`.

Propiedades principales:

| Prop             | Tipo              | Requerido | Descripción                                                     |
| :--------------- | :---------------- | :-------: | :-------------------------------------------------------------- |
| `name`           | `Path<T>`         |    Sí     | Nombre del campo en el formulario.                              |
| `control`        | `Control<T>`      |    Sí     | Objeto de control de `react-hook-form`.                         |
| `label`          | `string`          |    No     | Etiqueta visible sobre el input.                                |
| `rules`          | `RegisterOptions` |    No     | Reglas de validación (`required`, `validate`).                  |
| `max`            | `number`          |    No     | Número máximo de fichas permitidas.                             |
| `separator`      | `string`          |    No     | Carácter que actúa como separador para crear fichas (ej.: `,`). |
| `allowDuplicate` | `boolean`         |    No     | Permite ingresar valores repetidos. Default: `true`.            |
| `placeholder`    | `string`          |    No     | Texto de ayuda cuando el campo está vacío.                      |

## Ejemplos de uso

### 1. Etiquetas Simples (Keywords)

Uso básico para agregar palabras clave o tags.

```tsx
<MedinttChips
  name="palabrasClave"
  control={control}
  label="Palabras Clave"
  placeholder="Escriba y presione Enter..."
/>
```

### 2. Lista de Correos (Separador)

Configuración útil para enviar invitaciones o reportes a múltiples personas. El uso de `separator=","` permite pegar una lista de correos separados por comas y que se conviertan automáticamente en chips.

```tsx
<MedinttChips
  name="destinatarios"
  control={control}
  label="Enviar reporte a:"
  separator="," // Crea una ficha al escribir una coma
  placeholder="ejemplo@medintt.com, otro@medintt.com"
  rules={{
    required: "Ingrese al menos un destinatario",
    validate: (value) => value.length > 0 || "La lista no puede estar vacía",
  }}
/>
```

### 3. Restricción de Cantidad (Max)

Limitar la cantidad de elementos que el usuario puede ingresar.

```tsx
<MedinttChips
  name="sintomasPrincipales"
  control={control}
  label="Síntomas Principales (Máx. 3)"
  max={3} // Impide agregar más de 3 elementos
  rules={{
    validate: (value) =>
      (value && value.length <= 3) || "Solo puede ingresar hasta 3 síntomas",
  }}
/>
```

## Notas Técnicas

- **Tipo de Dato:** Este componente retorna siempre un **Array de Strings** (`string[]`).
  - Asegúrate de inicializar el valor en `defaultValues` como un array vacío `[]` para evitar errores de renderizado inicial.

- **Validación de Contenido:** PrimeReact `Chips` valida la entrada visualmente, pero si necesitas validar que cada chip sea, por ejemplo, un email válido, deberás hacerlo en el `onAdd` o mediante una validación personalizada (`validate`) en las `rules` que itere sobre el array de valores.

- `Diferencia con MultiSelect:` Usa `MedinttChips` cuando el usuario puede escribir cualquier cosa (texto libre). Usa `MedinttMultiSelect` cuando el usuario debe elegir entre opciones predefinidas.

## Dependencias

- `primereact`

- `react-hook-form`

- `tailwindcss`
