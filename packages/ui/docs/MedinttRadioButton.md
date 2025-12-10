# MedinttRadioButton

`MedinttRadioButton` es un componente wrapper que integra el **RadioButton** de PrimeReact con **React Hook Form**.

Este componente gestiona un **grupo** de opciones mutuamente excluyentes. Renderiza automáticamente la lista de botones de radio basada en un array de opciones, manejando la selección y validación del grupo entero.

## Importación

```tsx
import { MedinttRadioButton } from "@/components/MedinttRadioButton";
```

## Props

El componente acepta configuraciones para renderizar el grupo y las propiedades nativas de `RadioButtonProps` que se aplican a cada input individual.

Propiedades principales:

| Prop          | Tipo              | Requerido | Descripción                                                                        |
| :------------ | :---------------- | :-------: | :--------------------------------------------------------------------------------- |
| `name`        | `Path<T>`         |    Sí     | Nombre del campo en el formulario.                                                 |
| `control`     | `Control<T>`      |    Sí     | Objeto de control de `react-hook-form`.                                            |
| `options`     | `any[]`           |    Sí     | Array de opciones a renderizar.                                                    |
| `label`       | `string`          |    No     | Etiqueta principal del grupo de opciones.                                          |
| `optionLabel` | `string`          |    No     | Propiedad del objeto a mostrar como etiqueta (ej: `'label'`).                      |
| `optionValue` | `string`          |    No     | Propiedad a guardar como valor (ej: `'value'`).                                    |
| `rules`       | `RegisterOptions` |    No     | Reglas de validación (`required`).                                                 |
| `layout`      | `'row' \| 'col'`  |    No     | Dirección del diseño: `'row'` (horizontal) o `'col'` (vertical). Default: `'col'`. |

## Ejemplos de uso

### 1. Selección Simple (Sexo/Género)

Ejemplo básico con disposición horizontal (`row`).

```tsx
const generos = [
  { name: "Masculino", key: "M" },
  { name: "Femenino", key: "F" },
  { name: "Otro", key: "O" },
];

<MedinttRadioButton
  name="sexo"
  control={control}
  label="Sexo"
  options={generos}
  optionLabel="name"
  optionValue="key"
  layout="row" // Muestra las opciones una al lado de la otra
  rules={{ required: "Seleccione una opción" }}
/>;
```

### 2. Opciones Booleanas (Si/No)

Ideal para preguntas cerradas.

```tsx
const opcionesSiNo = [
  { label: "Sí", value: true },
  { label: "No", value: false },
];

<MedinttRadioButton
  name="tieneAlergias"
  control={control}
  label="¿El paciente presenta alergias?"
  options={opcionesSiNo}
  // Si el array tiene keys 'label' y 'value', no hace falta definir optionLabel/Value
  layout="row"
/>;
```

### 3. Disposición Vertical (Lista de Opciones)

Para listas con textos más largos, es mejor usar la disposición vertical por defecto.

```tsx
const tiposSeguro = [
  { nombre: "Particular", id: 1 },
  { nombre: "Obra Social", id: 2 },
  { nombre: "Prepaga", id: 3 },
];

<MedinttRadioButton
  name="tipoCobertura"
  control={control}
  label="Tipo de Cobertura"
  options={tiposSeguro}
  optionLabel="nombre"
  optionValue="id"
  layout="col" // Uno debajo del otro (Default)
/>;
```

## Estructura Visual

El componente renderiza:

1. Un `label` principal para el grupo (si se provee la prop `label`).

2. Un contenedor `div` flex que envuelve las opciones (controlado por `layout`).

3. Para cada opción:

- Un `RadioButton` de PrimeReact.

- Un `label` asociado (clicable) para mejorar la usabilidad.

## Notas Técnicas

- `Accesibilidad:` Cada radio button generado crea automáticamente un `inputId` único combinando el nombre del campo y el valor de la opción, asegurando que al hacer clic en el texto de la opción se seleccione el radio button correspondiente.

- `Validación:` El error se muestra a nivel de grupo. Si el campo es requerido y no se selecciona nada, el mensaje de error aparecerá debajo de todo el grupo de opciones.

- `Tipado:` Al igual que el Dropdown, si no especificas `optionValue`, el valor del formulario será el objeto completo de la opción seleccionada.

## Dependencias

- `primereact`

- `react-hook-form`

- `tailwindcss`
