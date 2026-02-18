import { Injectable } from '@nestjs/common';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { IncidentesLaboralesFilterDto } from './dto/incidentes-laborales-filter.dto';

import {
  rpt_Incidentes_de_Empresas,
  Prestatarias,
} from '@medintt/database-medintt4';

export type IncidenteLaboral = rpt_Incidentes_de_Empresas & {
  Prestataria: Prestatarias | null;
};

@Injectable()
export class IncidentesLaboralesService {
  constructor(private prisma: PrismaMedinttService) {}

  async findAll(user: JwtPayload, filters: IncidentesLaboralesFilterDto) {
    const medLabProject = process.env.MED_LAB_PROJECT;
    const roleAdmin = process.env.ROLE_ADMIN;
    const orgM = process.env.ORG_M;

    const membership = user.permissions?.[medLabProject!];
    const isAdmin =
      user.isSuperAdmin ||
      (membership?.role === roleAdmin && membership?.organizationCode === orgM);

    // Pagination defaults
    const limit =
      filters.limit && filters.limit > 0 ? Number(filters.limit) : 10;
    const page = filters.page && filters.page > 0 ? Number(filters.page) : 1;
    const skip = (page - 1) * limit;

    const where: any = {}; // Using any for Prisma WhereInput flexibility

    // Prestataria Filter
    if (isAdmin) {
      if (filters.prestatariaId) {
        where.Id_Prestataria = Number(filters.prestatariaId);
      }
    } else {
      const organizationCode = membership?.organizationCode;
      if (!organizationCode)
        return { data: [], meta: { total: 0, page, lastPage: 0 } };

      const prestataria = await this.prisma.prestatarias.findFirst({
        where: { Codigo: organizationCode },
        select: { Id: true },
      });

      if (!prestataria)
        return { data: [], meta: { total: 0, page, lastPage: 0 } };
      where.Id_Prestataria = prestataria.Id;
    }

    // Search Filter
    if (filters.search) {
      const search = filters.search.trim();
      where.OR = [
        { Paciente: { contains: search } },
        { DNI: { contains: search } },
        { Profesional: { contains: search } },
        { Clase: { contains: search } },
        { Notas: { contains: search } },
      ];
    }

    // Count Total
    const total = await this.prisma.rpt_Incidentes_de_Empresas.count({ where });

    // Fetch Data
    const incidentes = await this.prisma.rpt_Incidentes_de_Empresas.findMany({
      where,
      skip,
      take: limit,
      orderBy: { Fecha: 'desc' },
    });

    if (incidentes.length === 0) {
      return {
        data: [],
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    }

    const prestatariaIds = incidentes
      .map((i) => i.Id_Prestataria)
      .filter((id): id is number => id !== null);

    const uniqueIds = [...new Set(prestatariaIds)];

    let prestatariasMap = new Map<number, Prestatarias>();
    if (uniqueIds.length > 0) {
      const prestatarias = await this.prisma.prestatarias.findMany({
        where: { Id: { in: uniqueIds } },
      });
      prestatariasMap = new Map(prestatarias.map((p) => [p.Id, p]));
    }

    const data = incidentes.map((incidente) => ({
      ...incidente,
      Prestataria: incidente.Id_Prestataria
        ? prestatariasMap.get(incidente.Id_Prestataria) || null
        : null,
    }));

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
