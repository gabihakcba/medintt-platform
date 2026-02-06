**Actúa como:** Desarrollador Backend Senior experto en NestJS dentro de una arquitectura Monorepo.

**Objetivo:** Crear el esqueleto de una nueva micro-API en `apps/apis/api-[NOMBRE_DEL_MODULO]`.

**Reglas de Arquitectura (ESTRICTO):**

1.  **Dependencias Internas:** Debes usar los paquetes compartidos del monorepo:
    - `@medintt/database-[NOMBRE_DEL_MODULO]`: Para la conexión a DB.
    - `@medintt/types-[NOMBRE_DEL_MODULO]`: Para DTOs y tipos compartidos (asume que existe).
    - `@medintt/utils`: Para utilidades como fechas (`date.ts`).
2.  **Configuración:**
    - `tsconfig.json` debe extender de `../../packages/config-typescript/tsconfig.base.json`.

**Generables Requeridos:**

1.  **`package.json`**:
    - Nombre: `api-[NOMBRE_DEL_MODULO]`.
    - Dependencias: `@nestjs/common`, `@nestjs/core`, `rxjs`, `reflect-metadata`, y las dependencias internas usando `workspace:*`.

2.  **`src/main.ts`**:
    - Configuración estándar de NestJS.
    - Puerto: `process.env.PORT` con fallback (ej. 300X).
    - Prefijo global: `api/v1`.

3.  **`src/database/database.module.ts`**:
    - Crea un módulo global (`@Global()`) que provea el servicio de Prisma importado desde `@medintt/database-[NOMBRE_DEL_MODULO]`.
    - El servicio debe inyectarse y conectarse en `onModuleInit`.

4.  **`src/[recurso]/[recurso].service.ts` (Ejemplo)**:
    - Genera un servicio de ejemplo que use:
      - La inyección de la DB.
      - `import { ... } from '@medintt/utils'` para manejar una fecha en la lógica.

**Output esperado:**
Provee el código para `package.json`, `tsconfig.json`, `src/main.ts`, `src/database/database.module.ts` y un servicio de ejemplo.
