# @medintt/cloud-medintt

Este paquete centraliza la comunicación con la instancia de Nextcloud (Cloud Medintt) permitiendo gestionar usuarios y grupos mediante la Provisioning API (OCS), y gestionar archivos o directorios mediante WebDAV.

## Tarea 2: Integración en el Monorepo

### 1. Agregar dependencia a las APIs

Para utilizar este paquete en `apps/apis/api-auth` o `apps/apis/api-admin`, debes agregar la dependencia en sus respectivos `package.json`:

Modifica `apps/apis/api-auth/package.json` y `apps/apis/api-admin/package.json` añadiendo:

```json
{
  "dependencies": {
    "@medintt/cloud-medintt": "workspace:*" // o la versión correspondiente si no usas workspaces dinámicos, ej: "0.0.0"
  }
}
```

O si utilizas `pnpm` en tu monorepo:

```bash
pnpm add @medintt/cloud-medintt --filter api-auth
pnpm add @medintt/cloud-medintt --filter api-admin
```

### 2. Configurar Variables de Entorno

Asegúrate de que el archivo `.env` de las aplicaciones que consuman este módulo tengan definidas las siguientes variables:

```env
NEXTCLOUD_URL=https://nube.tu-dominio.com
NEXTCLOUD_ADMIN_USER=admin
NEXTCLOUD_ADMIN_PASSWORD=secret_app_password
```

### 3. Importar el Módulo

En el `AppModule` de la API (por ejemplo `apps/apis/api-auth/src/app.module.ts`), importa el `CloudMedinttModule`. Puesto que el módulo utiliza `ConfigService` internamente de NestJS, es importante asegurarse de que `ConfigModule` de NestJS esté inicializado y disponible de forma global o proveido en el mismo scope.

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CloudMedinttModule } from "@medintt/cloud-medintt";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CloudMedinttModule,
    AuthModule,
  ],
})
export class AppModule {}
```

### 4. Uso del Servicio

Al importar el módulo, el servicio `CloudMedinttService` estará automáticamente disponible a través de Dependency Injection al estar anotado con `@Global()`:

```typescript
import { Injectable } from "@nestjs/common";
import { CloudMedinttService } from "@medintt/cloud-medintt";

@Injectable()
export class AuthService {
  constructor(private readonly cloudMedintt: CloudMedinttService) {}

  async registerUser(userId: string) {
    // Sincronizar usuario
    await this.cloudMedintt.syncUser(
      userId,
      "correo@test.com",
      "mipassword",
      "Juan",
      "Perez",
    );

    // Asignar al grupo (ej: pacientes)
    await this.cloudMedintt.setUserGroup(userId, "pacientes");
  }
}
```
