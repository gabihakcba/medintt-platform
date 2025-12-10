# MEDINTT - Monorepo

Bienvenido al repositorio central de MEDINTT. Este proyecto utiliza una arquitectura de **Monorepo** para gestionar múltiples aplicaciones y paquetes compartidos en un solo lugar.

## ¿Qué es esto y por qué lo usamos?

Un monorepo nos permite tener:

1. **Código Compartido:** Definir una interfaz de TypeScript (`User`) en un solo lugar y usarla tanto en el Backend (NestJS) como en el Frontend (Next.js). Si cambia, ambos se enteran.

2. **UI Consistente:** Tener una librería de componentes (`ui`) que asegura que todos los paneles de administración se vean igual.

3. **Atomic Commits:** Hacer cambios en el backend y el frontend en un solo commit/PR.

## Estructura del Proyecto

```plaintext
.
├── apps/                  # Aplicaciones ejecutables
│   ├── web-admin/         # Panel Admin (Next.js)
│   ├── web-landing/       # Sitio público (Next.js)
│   └── api-core/          # Backend principal (NestJS)
│
├── packages/              # Librerías compartidas (No se ejecutan solas)
│   ├── ui/                # Componentes React (PrimeReact wrappers)
│   ├── types/             # Interfaces y Tipos TS compartidos (DTOs, Enums)
│   ├── config/            # Configs de ESLint, TSConfig, Tailwind
│   └── utils/             # Funciones helpers puras (formateo fechas, math)
│
├── package.json           # Root package.json (Workspaces config)
├── turbo.json             # Pipeline de compilación
└── pnpm-workspace.yaml    # Definición de workspaces
```

## Guía de Desarrollo "How-To"

### 1. Crear una Nueva Aplicación en `apps/`

Si necesitas crear un nuevo dashboard o servicio.

#### A. Nuevo Frontend (Next.js)

1. Ve a la carpeta de apps: `cd apps`

2. Ejecuta el creador: `npx create-next-app@latest mi-nueva-app --typescript`

3. **Importante:** Entra al package.json de la nueva app y agrega las dependencias compartidas:

```json
"dependencies": {
  "@medintt/ui": "workspace:*",
  "@medintt/types": "workspace:*",
  ...
}
```

4. Ejecuta `pnpm install` en la raíz del monorepo.

5. **Configuración Next.js** (`next.config.js`): Para que Next.js pueda leer los archivos `.tsx` de la carpeta packages/ui (que están fuera de su carpeta), debes transpilarlos:

```javascript
const nextConfig = {
  transpilePackages: ["@medintt/ui"],
};
module.exports = nextConfig;
```

#### B. Nuevo Backend (NestJS)

1. Ve a la carpeta de apps: `cd apps`

2. Ejecuta: `nest new microservicio-pagos`

3. Selecciona `pnpm` como gestor de paquetes.

4. Entra al `package.json` y vincula los tipos compartidos:

```json
"dependencies": {
  "@medintt/types": "workspace:*"
}
```

5. Ejecuta `pnpm install` en la raíz.

---

### 2. Crear un Nuevo Paquete en `packages/`

Digamos que quieres crear un paquete para lógica de validaciones compartida (`@medintt/validations`).

1. Crea la carpeta: `mkdir packages/validations`

2. Inicializa: `cd packages/validations && pnpm init`

3. Configura el `package.json`:

- **Name:** Debe tener el scope de la empresa: `"name": "@medintt/validations"`

- **Main/Types:** Indica dónde está el código fuente.

```json
{
  "name": "@medintt/validations",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint ."
  }
}
```

4. Crea tu código en `src/index.ts`.

---

### 3. Vincular y Exportar Código

Esta es la parte más importante. **¿Cómo hago visible un archivo nuevo?**

#### El patrón "Barrel File" (index.ts)

Cada paquete en `packages/` debe tener un `index.ts` en su raíz (o en `src/`) que actúa como la puerta pública.

**Ejemplo:** Creaste un componente `MedinttInputText.tsx` en `packages/ui/src/components/`.

1. El archivo existe, pero nadie lo ve aún.
2. Ve a `packages/ui/src/index.ts` y expórtalo:

```ts
// packages/ui/src/index.ts
export * from "./components/MedinttInputText";
export * from "./components/MedinttButton";
```

3. Ahora, desde la **App**, puedes importarlo así:

```tsx
import { MedinttInputText } from "@medintt/ui";
```

#### ¿Cómo refrescar los cambios?

Al usar `workspaces`, simplemente guardando el archivo en `packages/ui`, la aplicación de Next.js (si está corriendo) debería detectar el cambio gracias al Hot Module Replacement (HMR), ya que `transpilePackages` le dice que observe esa carpeta.

---

### 4. Compilación y TypeScript (La duda del millón)

> "Si el archivo es .ts, ¿cómo le digo al proyecto que primero lo compile?"

En este monorepo usamos dos estrategias dependiendo de qué estemos consumiendo:

#### A. Estrategia "Internal Packages" (Recomendada para UI y Types)

No compilamos los paquetes a `.js` antes de usarlos en desarrollo.

- **Next.js:** Usa `transpilePackages`. Next.js toma el código TypeScript crudo de `packages/ui` y lo compila "al vuelo" como si fuera parte de su propia carpeta `src`.

- **NestJS:** Si importas interfaces de `@medintt/types` (que son solo TypeScript), `ts-node` o el compilador de Nest lo resuelven automáticamente porque el `package.json` del paquete apunta a `"main": "./src/index.ts"`.

#### B. El flujo de Build (Producción)

Cuando haces deploy, usamos **TurboRepo** para orquestar el orden. En el archivo `turbo.json` definimos la dependencia de tareas:

```json
{
  "pipeline": {
    "build": {
      // "Asegúrate de haber construido las dependencias (^) antes de construir la app"
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

Esto asegura que si algún paquete necesita un paso de compilación previo, se ejecute antes de que la App intente construirse.

---

### 5. Comandos Útiles (Cheatsheet)

---

### Resolución de Problemas Comunes

#### 1. "Module not found: Can't resolve '@medintt/ui'"

- ¿Agregaste la dependencia en el `package.json` de la app?

- ¿Hiciste `pnpm install` en la raíz?

- ¿Está el nombre correcto en el `package.json` dentro de la carpeta `packages/ui`?

#### 2. "SyntaxError: Unexpected token..." en Next.js al importar UI

- Te falta agregar el paquete en `transpilePackages` dentro de `next.config.js`. Next.js por defecto no compila cosas dentro de `node_modules` (donde viven los symlinks de workspaces), hay que forzarlo.

3. **VS Code no autocompleta los tipos**

- Abre la "Command Palette" (`Ctrl+Shift+P`) y ejecuta `TypeScript: Restart TS Server`.

- Asegúrate de que el archivo nuevo esté exportado en el `index.ts` del paquete.
