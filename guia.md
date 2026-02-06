# Guía de Creación de Módulos en Medintt Platform

Este monorepo utiliza **Turborepo** y **pnpm**. La estructura es estricta para garantizar la consistencia entre aplicaciones y paquetes.

## Estructura del Proyecto

- **`apps/uis/`**: Aplicaciones Frontend (Next.js).
- **`apps/apis/`**: Aplicaciones Backend (NestJS).
- **`packages/databases/`**: Clientes de Prisma específicos por dominio.
- **`packages/types/`**: Definiciones de tipos compartidos (DTOs, Interfaces) para sincronizar Front y Back.
- **`packages/ui/`**: Librería de componentes de diseño (React + Tailwind).
- **`packages/utils/`**: Utilidades puras (fechas, formateadores).
- **`packages/config-*/`**: Configuraciones compartidas (Tailwind, TypeScript, ESLint).

---

## 1. Crear un Paquete de Base de Datos (`packages/databases/`)

Cada dominio grande (Auth, Medicina Laboral, etc.) debe tener su propio paquete de base de datos si requiere un esquema aislado.

1.  Crear carpeta: `packages/databases/database-<nombre>`.
2.  Inicializar `package.json` con nombre `@medintt/database-<nombre>`.
3.  Instalar dependencias: `prisma`, `@prisma/client`, `typescript`, `@types/node`.
4.  Crear `prisma/schema.prisma`.
5.  Exportar el `PrismaClient` en `src/index.ts`.
6.  **Regla de Oro:** No incluyas lógica de negocio aquí, solo el cliente de BD.

## 2. Crear una API (`apps/apis/`)

Las APIs se construyen con **NestJS**.

1.  Crear carpeta: `apps/apis/api-<nombre>`.
2.  Extender configuración de TS: `packages/config-typescript/tsconfig.base.json`.
3.  **Dependencias Clave:**
    - `@medintt/database-<nombre>`: Para acceso a datos.
    - `@medintt/types-<nombre>`: (Crear primero en `packages/types`) Para contratos de datos.
    - `@medintt/utils`: Para manejo de fechas (`date.ts`).
4.  **Estandarización:**
    - Usar `class-validator` para DTOs.
    - Respetar los interceptores de respuesta estándar.

## 3. Crear una UI (`apps/uis/`)

Las UIs se construyen con **Next.js (App Router)**.

1.  Crear carpeta: `apps/uis/ui-<nombre>`.
2.  **Configuración Visual:**
    - `tailwind.config.ts` debe importar los presets de `@medintt/config-tailwind`.
    - `globals.css` debe importar las directivas de Tailwind base.
3.  **Dependencias Clave:**
    - `@medintt/ui`: Para componentes visuales (Botones, Inputs, Tablas).
    - `@medintt/types-<nombre>`: Para tipado de respuestas de API.
    - `@medintt/utils`: Para fechas y helpers.
4.  **Fetching:** Usar Axios configurado (con credenciales) y React Query.

---

## Comandos Útiles

- `pnpm dev`: Levanta todo el entorno.
- `pnpm build`: Construye todas las apps y paquetes.
- `pnpm add <paquete> --filter <nombre-app>`: Instala dependencia en una app específica.
