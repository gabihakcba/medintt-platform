import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@medintt/database-medintt4';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { AusentismosFilterDto } from './dto/ausentismos-filter.dto';

@Injectable()
export class AusentismosService {
  constructor(private prisma: PrismaMedinttService) {}

  async findAll(user: JwtPayload, filters: AusentismosFilterDto = {}) {
    const limit = 10; // Requirement: 10 items always
    const page = filters.page && filters.page > 0 ? Number(filters.page) : 1;
    const skip = (page - 1) * limit;

    const medLabProject = process.env.MED_LAB_PROJECT;
    const roleAdmin = process.env.ROLE_ADMIN;
    const orgM = process.env.ORG_M;

    const membership = user.permissions?.[medLabProject!];
    const isAdmin =
      membership?.role === roleAdmin && membership?.organizationCode === orgM;

    // Build filters
    const where: Prisma.AusentismosWhereInput = {};

    // Date filters
    if (filters.desde && filters.hasta) {
      where.Fecha_Desde = { lte: new Date(filters.hasta) };
      where.Fecha_Hasta = { gte: new Date(filters.desde) };
    } else if (filters.mesReferencia) {
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

      where.OR = [
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

    // Role-based filtering
    if (user.isSuperAdmin || isAdmin) {
      // Admin can filter by prestataria
      if (filters.prestatariaId) {
        where.Id_Prestataria = Number(filters.prestatariaId);
      }
    } else {
      // Interlocutor: specific organization only
      const organizationCode = membership?.organizationCode;
      if (!organizationCode) {
        return { data: [], meta: { total: 0, page, lastPage: 0 } };
      }

      const prestataria = await this.prisma.prestatarias.findFirst({
        where: { Codigo: organizationCode },
        select: { Id: true },
      });

      if (!prestataria) {
        return { data: [], meta: { total: 0, page, lastPage: 0 } };
      }

      where.Id_Prestataria = prestataria.Id;
    }

    // Get Total Count
    const total = await this.prisma.ausentismos.count({ where });

    // Get Data
    const ausentismos = await this.prisma.ausentismos.findMany({
      where,
      skip,
      take: limit,
      orderBy: { Fecha_Desde: 'desc' }, // Good practice to have an order
      select: {
        Id: true,
        Id_Paciente: true,
        Id_Prestataria: true,
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
        Ausentismos_Attachs: {
          select: { Id: true, FileName: true, Extension: true },
        },
        Ausentismos_Certificados: {
          select: { Id: true, FileName: true, Extension: true },
        },
      },
    });

    // Enrich Data
    const pacienteIds = ausentismos
      .map((a) => a.Id_Paciente)
      .filter((id): id is number => id !== null);

    const prestatariaIds = ausentismos
      .map((a) => a.Id_Prestataria)
      .filter((id): id is number => id !== null);

    const [pacientes, prestatarias] = await Promise.all([
      this.prisma.pacientes.findMany({
        where: { Id: { in: pacienteIds } },
        select: {
          Id: true,
          Nombre: true,
          Apellido: true,
          NroDocumento: true,
        },
      }),
      this.prisma.prestatarias.findMany({
        where: { Id: { in: prestatariaIds } },
        select: { Id: true, Nombre: true },
      }),
    ]);

    const pacientesMap = new Map(pacientes.map((p) => [p.Id, p]));
    const prestatariasMap = new Map(prestatarias.map((p) => [p.Id, p]));

    const data = ausentismos.map((a) => ({
      ...a,
      paciente: a.Id_Paciente ? pacientesMap.get(a.Id_Paciente) : null,
      prestataria: a.Id_Prestataria
        ? prestatariasMap.get(a.Id_Prestataria)
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

  async findOne(id: number, user: JwtPayload) {
    const medLabProject = process.env.MED_LAB_PROJECT;
    const roleAdmin = process.env.ROLE_ADMIN;
    const orgM = process.env.ORG_M;

    const membership = user.permissions?.[medLabProject!];
    const isSuperAdminOrAdmin =
      user.isSuperAdmin ||
      (membership?.role === roleAdmin && membership?.organizationCode === orgM);

    const ausentismo = await this.prisma.ausentismos.findUnique({
      where: { Id: id },
      include: {
        Ausentismos_Categorias: { select: { Categoria: true } },
        Ausentismos_Attachs: {
          select: { Id: true, FileName: true, Extension: true },
        },
        Ausentismos_Certificados: {
          select: { Id: true, FileName: true, Extension: true },
        },
        Ausentismos_Bitacora: {
          select: { Id: true, Observaciones: true, Fecha: true },
          orderBy: { Fecha: 'asc' },
        },
        Ausentismos_Controles: {
          select: {
            Id: true,
            Instrucciones: true,
            Evolucion: true,
            Fecha_Control: true,
          },
          orderBy: { Fecha_Control: 'asc' },
        },
      },
    });

    if (!ausentismo) {
      return null;
    }

    // Security Check
    if (!isSuperAdminOrAdmin) {
      const organizationCode = membership?.organizationCode;
      if (!organizationCode) return null;

      const prestataria = await this.prisma.prestatarias.findFirst({
        where: { Codigo: organizationCode },
        select: { Id: true },
      });

      if (!prestataria || ausentismo.Id_Prestataria !== prestataria.Id) {
        return null; // Not authorized
      }
    }

    // Enrich
    const paciente = ausentismo.Id_Paciente
      ? await this.prisma.pacientes.findUnique({
          where: { Id: ausentismo.Id_Paciente },
          select: {
            Id: true,
            Nombre: true,
            Apellido: true,
            NroDocumento: true,
            Direccion: true,
            Email: true,
            Telefono: true,
            Celular1: true,
            FechaNacimiento: true,
          },
        })
      : null;

    const prestataria = ausentismo.Id_Prestataria
      ? await this.prisma.prestatarias.findUnique({
          where: { Id: ausentismo.Id_Prestataria },
          select: { Id: true, Nombre: true, Codigo: true },
        })
      : null;

    let informes: typeof informesRaw = [];
    const informesRaw = await this.prisma.ausentismos_Informes.findMany({
      where: { Id_Ausentismo: id },
      select: {
        Id: true,
        Informe: true,
        Fecha: true,
        Status: true,
      },
      orderBy: { Fecha: 'asc' },
    });

    if (isSuperAdminOrAdmin) {
      informes = informesRaw;
    } else {
      informes = informesRaw.filter(
        (i) => i.Status === 'TERMINADO' || i.Status === 'HISTORICO',
      );
    }

    return {
      ...ausentismo,
      paciente,
      prestataria,
      Ausentismos_Informes: informes,
    };
  }

  async getAttachment(id: number) {
    const attachment = await this.prisma.ausentismos_Attachs.findUnique({
      where: { Id: id },
    });
    if (!attachment || !attachment.Archivo)
      throw new NotFoundException('Attachment not found');
    return {
      buffer: attachment.Archivo,
      mimeType: this.getMimeType(attachment.Extension),
      fileName: attachment.FileName,
    };
  }

  async getCertificate(id: number) {
    const certificate = await this.prisma.ausentismos_Certificados.findUnique({
      where: { Id: id },
    });
    if (!certificate || !certificate.Archivo)
      throw new NotFoundException('Certificate not found');
    return {
      buffer: certificate.Archivo,
      mimeType: this.getMimeType(certificate.Extension),
      fileName: certificate.FileName,
    };
  }

  private getMimeType(extension: string | null): string {
    if (!extension) return 'application/octet-stream';
    const ext = extension.toLowerCase().replace('.', '');
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }
}
