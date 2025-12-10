# MedinttForm

Un componente orquestador que genera formularios completos basados en una configuración JSON, manejando automáticamente el layout responsivo (Grid), la validación y los tipos de inputs.

## Uso Básico

```tsx
import { useForm } from "react-hook-form";
import { MedinttForm, MedinttButton } from "@medintt/ui";

const MyPage = () => {
  const { control, handleSubmit } = useForm();

  return (
    <MedinttForm
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={(data) => console.log(data)}
      sections={[
        {
          group: "Datos Básicos",
          fields: [
            { type: "text", props: { name: "nombre", label: "Nombre" } },
            { type: "number", props: { name: "edad", label: "Edad" } },
          ],
        },
      ]}
      footer={<MedinttButton label="Guardar" type="submit" />}
    />
  );
};
```

## Configuración de Secciones (sections)

El formulario se divide en grupos visuales (Fieldset). Cada campo dentro de fields acepta:

| Propiedad | Tipo     | Descripción                                                            |
| :-------- | :------- | :--------------------------------------------------------------------- |
| `type`    | `string` | El tipo de input (`text`, `number`, `dropdown`, `calendar`, etc.).     |
| `colSpan` | `number` | (1-12) Ancho de la columna. `12` es 100%, `6` es 50%, etc.             |
| `props`   | `object` | Las propiedades específicas del componente input (ver doc individual). |

## Ejemplo Completo (Layout Grid)

```tsx
<MedinttForm
  control={control}
  handleSubmit={handleSubmit}
  onSubmit={save}
  sections={[
    {
      group: "Información Personal",
      fields: [
        // Dos columnas (50% cada uno)
        {
          type: "text",
          colSpan: 6,
          props: {
            name: "nombre",
            label: "Nombre",
            rules: { required: "Obligatorio" },
          },
        },
        {
          type: "text",
          colSpan: 6,
          props: {
            name: "apellido",
            label: "Apellido",
            rules: { required: "Obligatorio" },
          },
        },
        // Fila completa (100%)
        {
          type: "textarea",
          colSpan: 12,
          props: { name: "bio", label: "Biografía", rows: 3 },
        },
      ],
    },
  ]}
/>
```
