# MedinttInputNumber

`MedinttInputNumber` es un componente wrapper que integra el **InputNumber** de PrimeReact con **React Hook Form**.

Está diseñado para manejar entradas numéricas de forma robusta, soportando enteros, decimales y formatos de moneda, mientras gestiona automáticamente la vinculación con el estado del formulario y las validaciones.

## Importación

```tsx
import { MedinttInputNumber } from "@/components/MedinttInputNumber";
```

## Props

El componente acepta todas las propiedades nativas de `InputNumberProps` (de PrimeReact) excepto `name`, `value` y `onChange`.

Propiedades principales:

| Prop                | Tipo              | Requerido | Descripción                                                                  |
| :------------------ | :---------------- | :-------: | :--------------------------------------------------------------------------- |
| `name`              | `Path<T>`         |    Sí     | Nombre del campo en el formulario.                                           |
| `control`           | `Control<T>`      |    Sí     | Objeto de control de `react-hook-form`.                                      |
| `label`             | `string`          |    No     | Etiqueta visible sobre el input.                                             |
| `rules`             | `RegisterOptions` |    No     | Reglas de validación (min, max, required).                                   |
| `mode`              | `string`          |    No     | Modo de visualización: `'decimal'` o `'currency'`.                           |
| `currency`          | `string`          |    No     | Código de moneda (ej: `'ARS'`, `'USD'`) si `mode` es `'currency'`.           |
| `locale`            | `string`          |    No     | Configuración regional (ej: `'es-AR'`). Por defecto suele heredar la global. |
| `minFractionDigits` | `number`          |    No     | Mínimo de decimales a mostrar.                                               |
| `maxFractionDigits` | `number`          |    No     | Máximo de decimales permitidos.                                              |
| `showButtons`       | `boolean`         |    No     | Muestra botones de incremento/decremento.                                    |

## Ejemplos de uso

### 1. Número Entero Simple (Edad, Cantidad)

Uso básico con botones de incremento.

```tsx
<MedinttInputNumber
  name="edad"
  control={control}
  label="Edad"
  showButtons
  min={0}
  max={120}
  rules={{ required: "La edad es requerida" }}
/>
```

### 2. Formato de Moneda (Precios, Costos)

Ejemplo configurado para Pesos Argentinos (`ARS`) con validación de valor mínimo.

```tsx
<MedinttInputNumber
  name="precio"
  control={control}
  label="Precio Unitario"
  mode="currency"
  currency="ARS"
  locale="es-AR"
  minFractionDigits={2}
  rules={{
    required: "El precio es obligatorio",
    min: { value: 0.01, message: "El precio debe ser mayor a 0" },
  }}
/>
```

### 3. Decimales (Pesos, Medidas)

Input para valores que requieren precisión decimal pero no son moneda.

```tsx
<MedinttInputNumber
  name="peso"
  control={control}
  label="Peso (kg)"
  mode="decimal"
  minFractionDigits={1}
  maxFractionDigits={3}
  suffix=" kg" // Añade sufijo visual
/>
```

## Notas técnicas

- **Manejo de Null:** A diferencia de un input de texto, si el campo está vacío, el valor retornado a `react-hook-form` será `null` en lugar de un string vacío `""`. Es importante tener esto en cuenta al tipar los datos del formulario.

- **Validación Min/Max:** Se recomienda usar las props `min` y `max` de PrimeReact para restringir la entrada del usuario (impedir que escriba valores fuera de rango), y además usar `rules.min` y `rules.max` de React Hook Form para la validación lógica y el mensaje de error.

## Dependencias

- `primereact`

- `react-hook-form`

- `tailwindcss`
