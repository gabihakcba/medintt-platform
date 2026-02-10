import { Injectable } from '@nestjs/common';
import { Prisma } from '@medintt/database-medintt4';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { AusentismosFilterDto } from './dto/ausentismos-filter.dto';

@Injectable()
export class AusentismosService {
  constructor(private prisma: PrismaMedinttService) {}

  async findAll(user: JwtPayload, filters: AusentismosFilterDto = {}) {
    // If SuperAdmin or Admin of medicina-laboral in medintt org, return all ausentismos
    const medLabProject = process.env.MED_LAB_PROJECT;
    const roleAdmin = process.env.ROLE_ADMIN;
    const orgM = process.env.ORG_M;

    const membership = user.permissions?.[medLabProject!];
    const isAdmin =
      membership?.role === roleAdmin && membership?.organizationCode === orgM;

    // Build date filters
    const dateFilter: Prisma.AusentismosWhereInput = {};

    if (filters.desde && filters.hasta) {
      // Range filter: Find ausentismos that overlap with the date range
      // An ausentismo overlaps if: Fecha_Desde <= hasta AND Fecha_Hasta >= desde
      dateFilter.Fecha_Desde = { lte: new Date(filters.hasta) };
      dateFilter.Fecha_Hasta = { gte: new Date(filters.desde) };
    } else if (filters.mesReferencia) {
      // Monthly filter: Fecha_Desde or Fecha_Hasta within the month
      const refDate = new Date(filters.mesReferencia);
      const startOfMonth = new Date(
        refDate.getFullYear(),
        refDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        refDate.getFullYear(),
        refDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      dateFilter.OR = [
        {
          Fecha_Desde: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        {
          Fecha_Hasta: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      ];
    }

    if (user.isSuperAdmin || isAdmin) {
      // Return all ausentismos
      const ausentismos = await this.prisma.ausentismos.findMany({
        where: dateFilter,
        select: {
          Id_Paciente: true,
          Fecha_Desde: true,
          Fecha_Hasta: true,
          Fecha_Reincoporacion: true,
          Diagnostico: true,
          Evolucion: true,
          Ausentismos_Categorias: {
            select: {
              Categoria: true,
            },
          },
        },
      });

      // Enrich with patient data
      const pacienteIds = ausentismos
        .map((a) => a.Id_Paciente)
        .filter((id): id is number => id !== null);

      const pacientes = await this.prisma.pacientes.findMany({
        where: {
          Id: {
            in: pacienteIds,
          },
        },
        select: {
          Id: true,
          Nombre: true,
          Apellido: true,
          NroDocumento: true,
        },
      });

      const pacientesMap = new Map(pacientes.map((p) => [p.Id, p]));

      return ausentismos.map((a) => ({
        ...a,
        paciente: a.Id_Paciente ? pacientesMap.get(a.Id_Paciente) : null,
      }));
    }

    // If Interlocutor, return only ausentismos from their organization
    // Get the organization code from the user's membership
    const organizationCode = membership?.organizationCode;

    if (!organizationCode) {
      return [];
    }

    // Find the prestataria by code to get its numeric ID
    const prestataria = await this.prisma.prestatarias.findFirst({
      where: {
        Codigo: organizationCode,
      },
      select: {
        Id: true,
      },
    });

    if (!prestataria) {
      // Organization not found in Prestatarias table
      return [];
    }

    // Return ausentismos that match this prestataria ID
    const ausentismos = await this.prisma.ausentismos.findMany({
      where: {
        Id_Prestataria: prestataria.Id,
        ...dateFilter,
      },
      select: {
        Id_Paciente: true,
        Fecha_Desde: true,
        Fecha_Hasta: true,
        Fecha_Reincoporacion: true,
        Diagnostico: true,
        Evolucion: true,
        Ausentismos_Categorias: {
          select: {
            Categoria: true,
          },
        },
      },
    });

    // Enrich with patient data
    const pacienteIds = ausentismos
      .map((a) => a.Id_Paciente)
      .filter((id): id is number => id !== null);

    const pacientes = await this.prisma.pacientes.findMany({
      where: {
        Id: {
          in: pacienteIds,
        },
      },
      select: {
        Id: true,
        Nombre: true,
        Apellido: true,
        NroDocumento: true,
      },
    });

    const pacientesMap = new Map(pacientes.map((p) => [p.Id, p]));

    return ausentismos.map((a) => ({
      ...a,
      paciente: a.Id_Paciente ? pacientesMap.get(a.Id_Paciente) : null,
    }));
  }
}
