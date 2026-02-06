**Actúa como:** Desarrollador Frontend Senior experto en Next.js (App Router), Tailwind CSS y TypeScript.

**Objetivo:** Crear la estructura base de una aplicación frontend en `apps/uis/ui-[NOMBRE_DEL_MODULO]`.

**Sistema de Diseño y Reglas (ESTRICTO):**

1.  **UI Kit:** NO uses etiquetas HTML nativas (`<button>`, `<input>`) para elementos de formulario o interacción. DEBES importar y usar los componentes de `@medintt/ui` (ej: `MedinttButton`, `MedinttInputText`, `MedinttTable`).
2.  **Estilos:**
    - El `tailwind.config.ts` debe importar la configuración compartida: `import sharedConfig from "@medintt/config-tailwind/tailwind.config";`.
    - El `globals.css` debe importar las directivas de Tailwind.
3.  **Datos:**
    - Los tipos de respuesta de la API deben importarse de `@medintt/types-[NOMBRE_DEL_MODULO]`.
    - Configura Axios con `withCredentials: true` para soportar las cookies HttpOnly del sistema de Auth.

**Generables Requeridos:**

1.  **`package.json`**:
    - Nombre: `ui-[NOMBRE_DEL_MODULO]`.
    - Dependencias internas: `@medintt/ui`, `@medintt/config-tailwind`, `@medintt/utils`, `@medintt/types-[NOMBRE_DEL_MODULO]` (usando `workspace:*`).

2.  **`tailwind.config.ts`**:
    - Configuración que extienda la `sharedConfig` y apunte a `../../packages/ui/src/**/*.{ts,tsx}` para que funcione el JIT de Tailwind con la librería externa.

3.  **`src/lib/axios.ts`**:
    - Instancia configurada apuntando a `process.env.NEXT_PUBLIC_API_URL`.

4.  **`src/app/page.tsx` (Ejemplo)**:
    - Una página simple que muestre un título y un `MedinttButton`.

**Output esperado:**
Provee el código para `package.json`, `tailwind.config.ts`, `src/lib/axios.ts` y `src/app/page.tsx`.
