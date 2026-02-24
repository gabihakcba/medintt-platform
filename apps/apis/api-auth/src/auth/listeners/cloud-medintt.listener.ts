import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CloudMedinttService, CLOUD_SYNC_QUEUE } from '@medintt/cloud-medintt';
import { UserPermissionsUpdatedEvent } from '../events/user-permissions-updated.event';
import { UserDeletedEvent } from '../events/user-deleted.event';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CloudMedinttListener {
  private readonly logger = new Logger(CloudMedinttListener.name);

  constructor(
    private readonly cloudMedinttService: CloudMedinttService,
    @InjectQueue(CLOUD_SYNC_QUEUE) private cloudSyncQueue: Queue,
  ) {}

  @OnEvent('user.permissions.updated', { async: true })
  async handleUserPermissionsUpdatedEvent(event: UserPermissionsUpdatedEvent) {
    this.logger.log(
      `Handling user.permissions.updated for user: ${event.userId}`,
    );

    try {
      if (
        event.projectCode === process.env.CLOUD_PROJECT &&
        event.roleCode === process.env.ROLE_MEMBER &&
        event.organizationCode
      ) {
        if (event.action === 'deleted') {
          // Lógica de Supresión de Membresía
          await this.cloudMedinttService.removeUserFromGroup(
            event.userId,
            event.organizationCode,
          );
        } else {
          // Lógica de Creación/Actualización (registered, created, updated)
          // 1. Sincronización de Identidad
          await this.cloudMedinttService.syncUser(
            event.userId,
            event.nombreCompleto,
          );

          // 2. Lógica de Empresa (Idempotente) - AHORA ASÍNCRONA VÍA BULLMQ
          // Aseguramos grupo base de empresa y compartición
          await this.cloudMedinttService.initializeCompanyStorage(
            event.organizationCode,
          );
          // Insertamos usuario al grupo de su organización para ganar acceso
          await this.cloudMedinttService.addUserToGroup(
            event.userId,
            event.organizationCode,
          );

          // Agregamos el Job a la cola BullMQ para que el worker de admin procese carpetas
          await this.cloudSyncQueue.add(
            'sync-organization-folders',
            { orgCode: event.organizationCode },
            { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error in CloudMedinttListener (update): ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  @OnEvent('user.deleted', { async: true })
  async handleUserDeletedEvent(event: UserDeletedEvent) {
    this.logger.log(`Handling user.deleted for user: ${event.userId}`);
    try {
      if (event.isCloudMember) {
        await this.cloudMedinttService.deleteUser(event.userId);
      } else {
        this.logger.log(
          `User ${event.userId} was not a cloud-medintt member. Skipping WebDAV deletion.`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error in CloudMedinttListener (delete): ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
