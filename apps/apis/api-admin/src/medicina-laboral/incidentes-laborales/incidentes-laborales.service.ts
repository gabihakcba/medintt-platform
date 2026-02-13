import { Injectable } from '@nestjs/common';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import { JwtPayload } from 'src/common/types/jwt-payload.type';

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

  async findAll(user: JwtPayload): Promise<IncidenteLaboral[]> {
    const medLabProject = process.env.MED_LAB_PROJECT;
    const roleAdmin = process.env.ROLE_ADMIN;
    const orgM = process.env.ORG_M;

    const membership = user.permissions?.[medLabProject!];
    const isAdmin =
      user.isSuperAdmin ||
      (membership?.role === roleAdmin && membership?.organizationCode === orgM);
    const organizationCode = membership?.organizationCode;
    const prestataria = await this.prisma.prestatarias.findFirst({
      where: { Codigo: organizationCode },
    });

    let incidentes: rpt_Incidentes_de_Empresas[] = [];
    if (isAdmin) {
      incidentes = await this.prisma.rpt_Incidentes_de_Empresas.findMany({
        orderBy: { Fecha: 'desc' },
      });
    } else if (organizationCode) {
      incidentes = await this.prisma.rpt_Incidentes_de_Empresas.findMany({
        where: { Id_Prestataria: prestataria?.Id },
        orderBy: { Fecha: 'desc' },
      });
    }

    if (incidentes.length === 0) return [];

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

    return incidentes.map((incidente) => ({
      ...incidente,
      Prestataria: incidente.Id_Prestataria
        ? prestatariasMap.get(incidente.Id_Prestataria) || null
        : null,
    }));
  }
}
