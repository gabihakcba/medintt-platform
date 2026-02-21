import { Injectable } from '@nestjs/common';
import { Prisma } from '@medintt/database-medintt4';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { PacientesFilterDto } from './dto/pacientes-filter.dto';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaMedinttService) {}

  async findAll(
    user: JwtPayload,
    filters: PacientesFilterDto,
    bypassPagination: boolean = false,
  ) {
    const medLabProject = process.env.MED_LAB_PROJECT;
    const roleAdmin = process.env.ROLE_ADMIN;
    const orgM = process.env.ORG_M;

    const membership = user.permissions?.[medLabProject!];
    const isAdmin =
      user.isSuperAdmin ||
      (membership?.role === roleAdmin && membership?.organizationCode === orgM);

    const limit =
      filters.limit && filters.limit > 0 ? Number(filters.limit) : 10;
    const page = filters.page && filters.page > 0 ? Number(filters.page) : 1;
    const skip = bypassPagination ? undefined : (page - 1) * limit;
    const take = bypassPagination ? undefined : limit;

    const where: Prisma.PacientesWhereInput = {
      // Activo: 1, // Uncomment if we only want active patients
    };

    // Global Search Filter
    if (filters.search) {
      const search = filters.search.trim();
      where.OR = [
        { Nombre: { contains: search } }, // Case insensitive by default in MySQL/Postgres? Check collation. Prisma usually handles this depending on DB.
        { Apellido: { contains: search } },
        { NroDocumento: { contains: search } },
        { Email: { contains: search } },
      ];
    }

    let prestatariaIdFilter: number | undefined = undefined;

    if (isAdmin) {
      if (filters.prestatariaId) {
        prestatariaIdFilter = Number(filters.prestatariaId);
      }
    } else {
      // Interlocutor logic
      const organizationCode = membership?.organizationCode;
      if (!organizationCode)
        return { data: [], meta: { total: 0, page, lastPage: 0 } };

      const prestataria = await this.prisma.prestatarias.findFirst({
        where: { Codigo: organizationCode },
        select: { Id: true },
      });

      if (!prestataria)
        return { data: [], meta: { total: 0, page, lastPage: 0 } };

      prestatariaIdFilter = prestataria.Id;
    }

    // Apply Prestataria User Filter
    // Since Prestataria is linked via Afiliacion_Pacientes, we need to filter patients who have an affiliation with this Prestataria
    if (prestatariaIdFilter) {
      where.Afiliacion_Pacientes = {
        some: {
          Id_Prestataria: prestatariaIdFilter,
        },
      };
    }

    // Get Total Count
    const total = await this.prisma.pacientes.count({ where });

    // Get Data
    const patients = await this.prisma.pacientes.findMany({
      where,
      skip,
      take,
      orderBy: { Apellido: 'asc' }, // Order by Apellido
      select: {
        Id: true,
        Codigo: true,
        Apellido: true,
        Nombre: true,
        TipoDocumento: true,
        NroDocumento: true,
        FechaNacimiento: true,
        Direccion: true,
        Telefono: true,
        Celular1: true,
        Email: true,
        Cargo: true,
        Puesto: true,
        Activo: true,
        ImagenFirma: true,
      },
    });

    // Enrich Data
    const patientIds = patients.map((p) => p.Id);

    // Fetch exams count for each patient (batched) ONLY if requested
    const examsCountMap = filters.includeExamsCount
      ? await this.batchExamsCount(patientIds, prestatariaIdFilter)
      : new Map<number, number>();

    // Enrich with Prestatarias
    // We need to fetch affiliations for these patients to show their companies
    const afiliaciones = await this.prisma.afiliacion_Pacientes.findMany({
      where: { Id_Paciente: { in: patientIds } },
      select: {
        Id_Paciente: true,
        Id_Prestataria: true,
      },
    });

    // If we are filtering by a specific prestataria, we might still want to show ALL prestatarias the patient has,
    // OR just the one we filtered by. Usually user wants to see all companies the employee belongs to.
    // However, for Interlocutor, maybe they should only see their company?
    // The requirement says: "interlocutores solo los de su prestataria".
    // If an employee works for Company A and Company B, and I am Interlocutor for A.
    // I should see the employee. Should I see that they also work for B?
    // Usually Privacy says no. But current implementation showed all.
    // Let's stick to showing all for now unless restricted, but for Interlocutor we can filter the list of prestatarias attached to the object if needed.
    // Current implementation for Interlocutor was: "prestatarias: [prestataria], // We know they belong to this one".
    // So for Interlocutor we force only their prestataria.

    const patientPrestatariasMap = new Map<
      number,
      { Id: number; Nombre: string | null }[]
    >();

    if (!isAdmin && prestatariaIdFilter) {
      // Interlocutor: we only show their company
      // We need the name of the prestataria
      const prestatariaInfo = await this.prisma.prestatarias.findUnique({
        where: { Id: prestatariaIdFilter },
        select: { Id: true, Nombre: true },
      });
      if (prestatariaInfo) {
        patients.forEach((p) => {
          patientPrestatariasMap.set(p.Id, [prestatariaInfo]);
        });
      }
    } else {
      // Admin or no filter: show all companies for these patients
      const allPrestatariaIds = [
        ...new Set(
          afiliaciones
            .map((a) => a.Id_Prestataria)
            .filter((id): id is number => id !== null),
        ),
      ];

      const prestatariasInfos = await this.prisma.prestatarias.findMany({
        where: { Id: { in: allPrestatariaIds } },
        select: { Id: true, Nombre: true },
      });

      const prestatariaMap = new Map(prestatariasInfos.map((p) => [p.Id, p]));

      afiliaciones.forEach((af) => {
        if (af.Id_Paciente && af.Id_Prestataria) {
          const pInfo = prestatariaMap.get(af.Id_Prestataria);
          if (pInfo) {
            const list = patientPrestatariasMap.get(af.Id_Paciente) || [];
            if (!list.find((existing) => existing.Id === pInfo.Id)) {
              list.push(pInfo);
            }
            patientPrestatariasMap.set(af.Id_Paciente, list);
          }
        }
      });
    }

    const data = patients.map((p) => {
      const { ImagenFirma, ...rest } = p;
      return {
        ...rest,
        prestatarias: patientPrestatariasMap.get(p.Id) || [],
        examenesCount: examsCountMap.get(p.Id) || 0,
        hasFirma: !!ImagenFirma && ImagenFirma.length > 0,
        ...(bypassPagination ? { ImagenFirma } : {}),
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getSignature(
    id: number,
  ): Promise<{ buffer: Buffer; mimeType: string; fileName: string }> {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { Id: id },
      select: {
        ImagenFirma: true,
        NroDocumento: true,
        Apellido: true,
        Nombre: true,
      },
    });

    if (
      !paciente ||
      !paciente.ImagenFirma ||
      paciente.ImagenFirma.length === 0
    ) {
      throw new Error('Firma no encontrada para este paciente');
    }

    const dni = paciente.NroDocumento || 'SD';
    const nombre = `${paciente.Apellido}_${paciente.Nombre}`.replace(
      /[^a-zA-Z0-9_]/g,
      '',
    );

    return {
      buffer: Buffer.from(paciente.ImagenFirma),
      mimeType: 'image/png',
      fileName: `firma_${dni}_${nombre}.png`,
    };
  }

  private async batchExamsCount(
    patientIds: number[],
    prestatariaId?: number,
  ): Promise<Map<number, number>> {
    const CHUNK_SIZE = 1000;
    const examsCountMap = new Map<number, number>();

    for (let i = 0; i < patientIds.length; i += CHUNK_SIZE) {
      const chunk = patientIds.slice(i, i + CHUNK_SIZE);
      const where: Prisma.Examenes_Laborales_PacientesWhereInput = {
        Id_Paciente: { in: chunk },
      };

      if (prestatariaId) {
        where.Examenes_Laborales = {
          Id_Prestataria: prestatariaId,
        };
      }

      const examsCounts =
        await this.prisma.examenes_Laborales_Pacientes.groupBy({
          by: ['Id_Paciente'],
          _count: {
            Id: true,
          },
          where,
        });

      examsCounts.forEach((e) => {
        if (e.Id_Paciente) {
          examsCountMap.set(e.Id_Paciente, e._count.Id);
        }
      });
    }

    return examsCountMap;
  }
}
