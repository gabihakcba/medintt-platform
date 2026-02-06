**Actúa como:** Arquitecto de Software experto en Monorepos con Turborepo, pnpm y Prisma ORM.

**Objetivo:** Generar la estructura y archivos para un nuevo paquete de base de datos aislado en el monorepo.

**Contexto del Proyecto:**

- **Repo:** Monorepo `@medintt/platform`.
- **Ruta de destino:** `packages/databases/database-[NOMBRE_DEL_MODULO]`.
- **Gestor de paquetes:** pnpm (usando workspaces).

**Instrucciones Generales:**
Quiero que generes los archivos necesarios para crear este paquete. No uses versiones de dependencias hardcodeadas, asume que `pnpm` resolverá las versiones compatibles con el workspace.

**Requerimientos Específicos por Archivo:**

1.  **`package.json`**:
    - Nombre del paquete: `@medintt/database-[NOMBRE_DEL_MODULO]`.
    - `main`: "dist/index.js".
    - `types`: "dist/index.d.ts".
    - Scripts obligatorios:
      - `"build": "prisma generate && tsc"`.
      - `"db:push": "prisma db push"`.
      - `"studio": "prisma studio"`.
    - Dependencias de desarrollo: `prisma`, `typescript`, `@types/node`.
    - Dependencias: `@prisma/client`.

2.  **`tsconfig.json`**:
    - Debe extender la configuración base del monorepo: `../../config-typescript/tsconfig.base.json`.
    - Include: `["src/**/*"]`.

3.  **`prisma/schema.prisma`**:
    - Define un `datasource` db (postgresql) y un `generator` client.
    - Crea un modelo de ejemplo llamado `Example[NombreModulo]` con campos básicos (id, createdAt, updatedAt).

4.  **`src/index.ts`**:
    - Inicializa y exporta una instancia de `PrismaClient` (evitando múltiples instancias en desarrollo si es posible).
    - Exporta todos los tipos generados por Prisma (`export * from '@prisma/client'`).

**Output esperado:**
Dame el código de los 4 archivos mencionados en bloques de código separados.
