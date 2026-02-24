import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class CloudMedinttService {
  private readonly logger = new Logger(CloudMedinttService.name);
  private ocsClient: AxiosInstance;
  private sharingClient: AxiosInstance;
  private webdavClient: AxiosInstance;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>("NEXTCLOUD_URL") || "";
    const username =
      this.configService.get<string>("NEXTCLOUD_ADMIN_USER") || "";
    const password =
      this.configService.get<string>("NEXTCLOUD_ADMIN_PASSWORD") || "";

    // Cliente HTTP para OCS (Provisioning API - Usuarios y Grupos)
    this.ocsClient = axios.create({
      baseURL: `${this.baseUrl}/ocs/v1.php/cloud`,
      auth: { username, password },
      headers: {
        "OCS-APIRequest": "true",
        Accept: "application/json",
      },
    });

    // Cliente HTTP para Sharing API (Permisos)
    this.sharingClient = axios.create({
      baseURL: `${this.baseUrl}/ocs/v1.php/apps/files_sharing/api/v1`,
      auth: { username, password },
      headers: {
        "OCS-APIRequest": "true",
        Accept: "application/json",
      },
    });

    // Cliente HTTP para WebDAV (Files API - Carpetas)
    this.webdavClient = axios.create({
      baseURL: `${this.baseUrl}/remote.php/webdav/`,
      auth: { username, password },
      headers: {
        "OCS-APIRequest": "true",
      },
    });
  }

  // ==========================================
  // OCS - PROVISIONING API (Gestión de Usuarios y Grupos)
  // ==========================================

  /**
   * Verifica existencia y crea usuario si no existe.
   */
  async syncUser(
    userId: string,
    displayName: string,
    email?: string,
  ): Promise<void> {
    const nextcloudUserId = `Medintt-${userId}`;
    try {
      this.logger.log(
        `Verificando/Creando usuario en Nextcloud: ${nextcloudUserId}`,
      );

      try {
        // Verificar si existe
        const response = await this.ocsClient.get(`/users/${nextcloudUserId}`);

        const statusCode = response.data?.ocs?.meta?.statuscode;
        // Nextcloud devuelve HTTP 200 pero con status interno 404 o 996 si el usuario no existe.
        if (statusCode === 404 || statusCode === 996) {
          throw new Error("USER_NOT_FOUND");
        }

        this.logger.log(`Usuario ${nextcloudUserId} ya existe.`);
        // Podríamos actualizar el displayName aquí si hiciera falta usando PUT.
      } catch (error: any) {
        if (
          error.message === "USER_NOT_FOUND" ||
          error.response?.data?.ocs?.meta?.statuscode === 404 ||
          error.response?.status === 404
        ) {
          // No existe, crear
          const payload: any = {
            userid: nextcloudUserId,
            password: Math.random().toString(36).substring(2, 15), // Contraseña aleatoria por defecto ya que Nextcloud debe validarlo por SSO idealmente, o lo forzamos.
            displayName: displayName.trim(),
          };
          if (email) {
            payload.email = email.trim();
          }
          await this.ocsClient.post("/users", payload);
          this.logger.log(`Usuario ${nextcloudUserId} creado exitosamente.`);
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      this.logger.error(
        `Error al sincronizar usuario ${nextcloudUserId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Elimina al usuario de Nextcloud.
   */
  async deleteUser(userId: string): Promise<void> {
    const nextcloudUserId = `Medintt-${userId}`;
    try {
      this.logger.log(`Eliminando usuario ${nextcloudUserId} de Nextcloud.`);
      await this.ocsClient.delete(`/users/${nextcloudUserId}`);
      this.logger.log(`Usuario ${nextcloudUserId} eliminado.`);
    } catch (error: any) {
      if (
        error.response?.data?.ocs?.meta?.statuscode === 404 ||
        error.response?.status === 404
      ) {
        this.logger.log(
          `Usuario ${nextcloudUserId} no encontrado para eliminar.`,
        );
      } else {
        this.logger.error(
          `Error al eliminar usuario ${nextcloudUserId}: ${error.message}`,
        );
        throw error;
      }
    }
  }

  /**
   * Crea un grupo si no existe.
   */
  async createGroup(groupId: string): Promise<void> {
    try {
      this.logger.log(`Verificando grupo ${groupId}`);
      await this.ocsClient.post("/groups", { groupid: groupId });
      this.logger.log(`Grupo ${groupId} creado exitosamente.`);
    } catch (error: any) {
      // 102 significa que el grupo ya existe
      if (error.response?.data?.ocs?.meta?.statuscode === 102) {
        this.logger.log(`El grupo ${groupId} ya existe.`);
      } else {
        this.logger.error(`Error al crear grupo ${groupId}: ${error.message}`);
        throw error;
      }
    }
  }

  /**
   * Crea el grupo si no existe y añade al usuario.
   */
  async addUserToGroup(userId: string, groupId: string): Promise<void> {
    const nextcloudUserId = `Medintt-${userId}`;
    try {
      await this.createGroup(groupId);

      this.logger.log(
        `Añadiendo usuario ${nextcloudUserId} al grupo ${groupId}`,
      );
      await this.ocsClient.post(`/users/${nextcloudUserId}/groups`, {
        groupid: groupId,
      });
      this.logger.log(
        `Usuario ${nextcloudUserId} asignado al grupo ${groupId} exitosamente.`,
      );
    } catch (error: any) {
      if (error.response?.data?.ocs?.meta?.statuscode === 102) {
        this.logger.log(
          `El usuario ${nextcloudUserId} ya pertenece al grupo ${groupId}.`,
        );
        return;
      }
      this.logger.error(
        `Error al asignar usuario ${nextcloudUserId} al grupo ${groupId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Elimina al usuario de un grupo en Nextcloud.
   */
  async removeUserFromGroup(userId: string, groupId: string): Promise<void> {
    const nextcloudUserId = `Medintt-${userId}`;
    try {
      this.logger.log(
        `Removiendo usuario ${nextcloudUserId} del grupo ${groupId}`,
      );
      await this.ocsClient.delete(`/users/${nextcloudUserId}/groups`, {
        data: { groupid: groupId },
      });
      this.logger.log(
        `Usuario ${nextcloudUserId} removido del grupo ${groupId} exitosamente.`,
      );
    } catch (error: any) {
      if (
        error.response?.data?.ocs?.meta?.statuscode === 404 ||
        error.response?.status === 404
      ) {
        this.logger.log(
          `Usuario o grupo no encontrado al intentar remover a ${nextcloudUserId} de ${groupId}.`,
        );
      } else {
        this.logger.error(
          `Error al remover usuario ${nextcloudUserId} del grupo ${groupId}: ${error.message}`,
        );
        throw error;
      }
    }
  }

  // ==========================================
  // WEBDAV - FILES API (Gestión de Carpetas)
  // ==========================================

  /**
   * Asegura que toda la jerarquía de carpetas exista usando el método HTTP MKCOL.
   * La ruta (path) es relativa, ej: 'Legajos/Empresa1/PacienteA/Modulo1'
   */
  async createFolderStructure(basePath: string): Promise<void> {
    const folders = basePath.split("/").filter((f) => f.trim().length > 0);
    let currentPath = "";

    for (const folder of folders) {
      currentPath += `${folder}/`;
      try {
        await this.webdavClient.request({
          method: "MKCOL",
          url: currentPath,
        });
        this.logger.debug(`Carpeta creada: ${currentPath}`);
      } catch (error: any) {
        // HTTP 405 Method Not Allowed significa que la carpeta ya existe en WebDAV
        if (error.response?.status !== 405) {
          this.logger.error(
            `Error al crear carpeta ${currentPath}: ${error.message}`,
          );
          throw error;
        }
      }
    }
  }

  // ==========================================
  // SHARING API (Gestión de Permisos)
  // ==========================================

  /**
   * Comparte una carpeta específica con un grupo de Nextcloud.
   * Permisos: 1=leer, 31=todos, etc.
   */
  async shareFolderWithGroup(
    path: string,
    groupName: string,
    permissions: number = 31,
  ): Promise<void> {
    try {
      this.logger.log(
        `Compartiendo [${path}] con grupo [${groupName}] - Permisos: ${permissions}`,
      );

      const payload = {
        path: `/${path}`, // Nextcloud espera que el path absoluto o empiece con barra para a Share API
        shareType: 1, // 1 = Grupo
        shareWith: groupName,
        permissions: permissions,
      };

      await this.sharingClient.post("/shares", null, { params: payload });
      this.logger.log(`Carpeta compartida exitosamente.`);
    } catch (error: any) {
      this.logger.error(
        `Error al compartir carpeta ${path} con el grupo ${groupName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Asegura que una carpeta exista usando el método HTTP MKCOL. Ignora error 405 (existe).
   */
  async ensureFolderExists(path: string): Promise<void> {
    try {
      await this.webdavClient.request({
        method: "MKCOL",
        url: encodeURI(path.endsWith("/") ? path : `${path}/`),
      });
      this.logger.debug(`Carpeta creada: ${path}`);
    } catch (error: any) {
      if (error.response?.status !== 405) {
        this.logger.error(`Error al crear carpeta ${path}: ${error.message}`);
        throw error;
      }
    }
  }

  /**
   * Crea toda la estructura requerida del paciente (Legajo y Módulos) de forma asíncrona.
   */
  async createPatientLegajoStructure(
    orgCode: string,
    paciente: any,
  ): Promise<void> {
    const rootPath = "Legajos/";
    const orgPath = `${rootPath}Legajos ${orgCode}/`;
    const patientFolder =
      `${paciente.Apellido}_${paciente.Nombre}_${paciente.DNI}`
        .replace(/\s+/g, "_")
        .toUpperCase();
    const patientPath = `${orgPath}${patientFolder}/`;

    // 1. Root & Empresa & Paciente
    await this.ensureFolderExists(rootPath);
    await this.ensureFolderExists(orgPath);
    await this.ensureFolderExists(patientPath);

    // 2. Módulo 1 (con subcarpetas)
    const modulo1 = `${patientPath}Modulo 1 | PREOCUPACIONALES-PERIODICOS/`;
    await this.ensureFolderExists(modulo1);
    await this.ensureFolderExists(`${modulo1}PREOCUPACIONALES/`);
    await this.ensureFolderExists(`${modulo1}PERIODICOS/`);

    // 3. Otros Módulos
    await this.ensureFolderExists(
      `${patientPath}Modulo 2 | ACCIDENTES Y ENFERMEDAD PROFESIONAL/`,
    );
    await this.ensureFolderExists(
      `${patientPath}Modulo 3 | ENFERMEDADES INCULPABLES/`,
    );
    await this.ensureFolderExists(
      `${patientPath}Modulo 4 | CAPACITACIONES - PREVENCION/`,
    );
    await this.ensureFolderExists(
      `${patientPath}Modulo 5 | DOCUMENTACION - PLANILLAS/`,
    );
  }

  // ==========================================
  // LÓGICA DE NEGOCIO PARA MEDINTT
  // ==========================================

  /**
   * Crea la carpeta Legajos/Legajos ${empresaName}.
   * Crea un grupo en Nextcloud llamado ${empresaName}.
   * Comparte la carpeta de la empresa con ese grupo.
   */
  async initializeCompanyStorage(empresaName: string): Promise<void> {
    this.logger.log(
      `Inicializando almacenamiento para empresa: ${empresaName}`,
    );

    const companyPath = `Legajos/Legajos ${empresaName}`;

    // 1. Crear carpeta base de legajos y de la empresa
    await this.createFolderStructure(companyPath);

    // 2. Crear grupo si no existe
    await this.createGroup(empresaName);

    // 3. Compartir carpeta de la empresa con el grupo
    await this.shareFolderWithGroup(companyPath, empresaName, 31);

    this.logger.log(
      `Almacenamiento de ${empresaName} inicializado correctamente.`,
    );
  }

  /**
   * Crea las carpetas por paciente y sus módulos dentro de la carpeta de la empresa.
   */
  async initializePatientStorage(
    empresaName: string,
    pacientesData: { nombre: string; apellido: string; dni: string }[],
  ): Promise<void> {
    this.logger.log(
      `Inicializando almacenamiento de pacientes para ${empresaName}`,
    );

    const companyPath = `Legajos/Legajos ${empresaName}`;
    const modules = [
      "Modulo 1 PREOCUPACIONALES-PERIODICOS",
      "Modulo 2 AACIDENTES Y ENFERMEDAD PROFESIONAL",
      "Modulo 3 ENFERMEDADES INCULPABLES",
      "Modulo 4 CAPACITACIONES-PREVENCION",
      "Modulo 5 DOCUMENTACION-PLANILLAS",
    ];

    for (const paciente of pacientesData) {
      const folderName =
        `${paciente.apellido}_${paciente.nombre}_${paciente.dni}`
          .replace(/\s+/g, "_")
          .toUpperCase();
      const patientPath = `${companyPath}/${folderName}`;

      this.logger.log(
        `Creando carpetas de módulos para paciente: ${folderName}`,
      );
      for (const modulo of modules) {
        await this.createFolderStructure(`${patientPath}/${modulo}`);
      }
    }

    this.logger.log(
      `Almacenamiento de ${pacientesData.length} pacientes inicializado correctamente en ${empresaName}.`,
    );
  }
}
