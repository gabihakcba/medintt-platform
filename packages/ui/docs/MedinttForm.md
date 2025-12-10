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
            { type: "number", props: { name: "edad", label: "Edad" } }
          ]
        }
      ]}
      footer={<MedinttButton label="Guardar" type="submit" />}
    />
  );
};
```