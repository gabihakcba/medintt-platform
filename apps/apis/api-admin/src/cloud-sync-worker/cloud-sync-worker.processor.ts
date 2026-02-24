import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaMedinttService } from '../prisma-medintt/prisma-medintt.service';
import { CloudMedinttService, CLOUD_SYNC_QUEUE } from '@medintt/cloud-medintt';

@Processor(CLOUD_SYNC_QUEUE, { concurrency: 5 })
export class CloudSyncWorkerProcessor extends WorkerHost {
  private readonly logger = new Logger(CloudSyncWorkerProcessor.name);

  constructor(
    private readonly prisma: PrismaMedinttService,
    private readonly cloudMedinttService: CloudMedinttService,
  ) {
    super();
  }

  async process(job: Job<{ orgCode: string }>) {
    const { orgCode } = job.data;
    const startLog = `Iniciando sincronización masiva para la empresa: ${orgCode}`;
    this.logger.log(startLog);
    await job.log(startLog);

    try {
      if (job.name === 'sync-organization-folders') {
        // Buscar prestataria por orgCode
        const prestataria = await this.prisma.prestatarias.findFirst({
          where: { Codigo: orgCode },
        });

        if (!prestataria) {
          this.logger.warn(
            `No se encontró prestataria (Empresa) con Codigo: ${orgCode}`,
          );
          return;
        }

        // Buscar pacientes/empleados asociados a la prestataria (código orgCode)
        const pacientes = await this.prisma.pacientes.findMany({
          where: {
            Afiliacion_Pacientes: {
              some: {
                Id_Prestataria: prestataria.Id,
              },
            },
          },
        });

        const total = pacientes.length;
        this.logger.log(
          `Encontrados ${total} pacientes para ${orgCode}. Procesando...`,
        );
        await job.log(`Total a procesar: ${total} pacientes.`);

        let successCount = 0;

        for (let index = 0; index < total; index++) {
          const paciente = pacientes[index];
          if (
            !paciente.Apellido ||
            !paciente.Nombre ||
            !paciente.NroDocumento
          ) {
            this.logger.warn(
              `Paciente ID ${paciente.Id} ignorado (faltan datos clave).`,
            );
            await job.log(
              `⚠️ Paciente ID ${paciente.Id} ignorado (faltan datos clave).`,
            );

            const progress = Math.round(((index + 1) / total) * 100);
            await job.updateProgress(progress);
            continue;
          }

          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            await this.cloudMedinttService.createPatientLegajoStructure(
              orgCode,
              {
                Nombre: paciente.Nombre,
                Apellido: paciente.Apellido,
                DNI: paciente.NroDocumento,
              },
            );
            await job.log(
              `✅ Legajo creado: ${paciente.Apellido} - ${paciente.NroDocumento}`,
            );
            successCount++;
          } catch (err: unknown) {
            const errorMessage =
              err instanceof Error ? err.message : String(err);
            this.logger.error(
              `Error creando estructura para paciente ${paciente.NroDocumento}: ${errorMessage}`,
            );
            await job.log(
              `❌ Error en legajo ${paciente.NroDocumento}: ${errorMessage}`,
            );
            // Permitimos que la iteración continúe si la creación de un paciente falla
          }

          const progress = Math.round(((index + 1) / total) * 100);
          await job.updateProgress(progress);
        }

        const successRatioMsg = `Sincronización masiva finalizada para ${orgCode}. Éxitos: ${successCount} de ${total} legajos.`;
        this.logger.log(successRatioMsg);
        await job.log(successRatioMsg);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error en job sync-organization-folders para ${orgCode}: ${errorMessage}`,
      );
      throw error; // Reintenta según configuración de attempts
    }
  }
}
