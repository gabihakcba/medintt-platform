# MedinttPassword

`MedinttPassword` es un componente wrapper que integra el componente **Password** de PrimeReact con **React Hook Form**.

Provee una solución completa para campos de contraseña, incluyendo funcionalidades como máscara de ocultación (`toggleMask`) y medidor de fortaleza de contraseña (`feedback`), todo bajo el ecosistema de validación de formularios.

## Importación

```tsx
import { MedinttPassword } from "@/components/MedinttPassword";
```

## Props

El componente acepta todas las propiedades nativas de `PasswordProps` (de PrimeReact) excepto `name`, `value` y `onChange`.

Propiedades destacadas:

| Prop          | Tipo              | Requerido | Descripción                                                                                          |
| :------------ | :---------------- | :-------: | :--------------------------------------------------------------------------------------------------- |
| `name`        | `Path<T>`         |    Sí     | Nombre del campo en el formulario.                                                                   |
| `control`     | `Control<T>`      |    Sí     | Objeto de control de `react-hook-form`.                                                              |
| `label`       | `string`          |    No     | Etiqueta visible sobre el input.                                                                     |
| `rules`       | `RegisterOptions` |    No     | Reglas de validación (`required`, `minLength`, `validate`).                                          |
| `toggleMask`  | `boolean`         |    No     | Si es `true`, muestra un ícono para revelar/ocultar la contraseña.                                   |
| `feedback`    | `boolean`         |    No     | Si es `true`, muestra el medidor de fortaleza de la contraseña. Útil para registros, no para logins. |
| `promptLabel` | `string`          |    No     | Texto inicial del medidor de fortaleza.                                                              |
| `weakLabel`   | `string`          |    No     | Texto para contraseña débil.                                                                         |
| `mediumLabel` | `string`          |    No     | Texto para contraseña media.                                                                         |
| `strongLabel` | `string`          |    No     | Texto para contraseña fuerte.                                                                        |

## Ejemplos de uso

### 1. Login (Sin Medidor de Fortaleza)

Para formularios de inicio de sesión, generalmente no se necesita el medidor de fortaleza (`feedback={false}`), pero sí el botón para ver la contraseña (`toggleMask`).

```tsx
<MedinttPassword
  name="password"
  control={control}
  label="Contraseña"
  feedback={false} // Oculta la barra de fortaleza
  toggleMask // Muestra el ícono de ojo
  rules={{ required: "La contraseña es obligatoria" }}
/>
```

### 2. Registro de Usuario (Con Medidor de Fortaleza)

Para crear nuevas cuentas, habilitamos el `feedback` para guiar al usuario a crear una clave segura.

```tsx
<MedinttPassword
  name="newPassword"
  control={control}
  label="Nueva Contraseña"
  toggleMask
  feedback={true}
  promptLabel="Ingrese una contraseña"
  weakLabel="Débil"
  mediumLabel="Normal"
  strongLabel="Fuerte"
  rules={{
    required: "Campo obligatorio",
    minLength: {
      value: 8,
      message: "Debe tener al menos 8 caracteres",
    },
  }}
/>
```

### 3. Confirmar Contraseña (Validación Cruzada)

Ejemplo avanzado usando `validate` de React Hook Form para asegurar que coincida con otro campo.

```tsx
<MedinttPassword
  name="confirmPassword"
  control={control}
  label="Confirmar Contraseña"
  feedback={false}
  toggleMask
  rules={{
    required: "Confirme su contraseña",
    validate: (value) =>
      value === watch("newPassword") || "Las contraseñas no coinciden",
  }}
/>
```

## Estilos y Personalización

- **Ancho Completo:** El componente inyecta automáticamente clases para asegurar que el input ocupe el ancho disponible (`w-full`), corrigiendo el comportamiento por defecto de PrimeReact donde el `Password` a veces no se expande completamente.

- **Iconos:** Utiliza los iconos estándar de PrimeIcons (`pi pi-eye`, etc.) para el `toggleMask`.

## Dependencias

- `primereact`

- `react-hook-form`

- `primeicons`

- `tailwindcss`
