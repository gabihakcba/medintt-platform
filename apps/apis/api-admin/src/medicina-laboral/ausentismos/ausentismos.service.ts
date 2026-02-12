import { Injectable, NotFoundException } from '@nestjs/common';
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

      // Enrich with patient data & Prestataria
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

      return ausentismos.map((a) => ({
        ...a,
        paciente: a.Id_Paciente ? pacientesMap.get(a.Id_Paciente) : null,
        prestataria: a.Id_Prestataria
          ? prestatariasMap.get(a.Id_Prestataria)
          : null,
      }));
    }

    // If Interlocutor, return only ausentismos from their organization
    const organizationCode = membership?.organizationCode;

    if (!organizationCode) {
      return [];
    }

    const prestataria = await this.prisma.prestatarias.findFirst({
      where: { Codigo: organizationCode },
      select: { Id: true, Nombre: true },
    });

    if (!prestataria) {
      return [];
    }

    const ausentismos = await this.prisma.ausentismos.findMany({
      where: {
        Id_Prestataria: prestataria.Id,
        ...dateFilter,
      },
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
          select: { Categoria: true },
        },
        Ausentismos_Attachs: {
          select: { Id: true, FileName: true, Extension: true },
        },
        Ausentismos_Certificados: {
          select: { Id: true, FileName: true, Extension: true },
        },
      },
    });

    // Enrich with patient data
    const pacienteIds = ausentismos
      .map((a) => a.Id_Paciente)
      .filter((id): id is number => id !== null);

    const pacientes = await this.prisma.pacientes.findMany({
      where: { Id: { in: pacienteIds } },
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
      prestataria: prestataria, // Already have this
    }));
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
          orderBy: { Fecha: 'desc' },
        },
        Ausentismos_Controles: {
          select: {
            Id: true,
            Instrucciones: true,
            Evolucion: true,
            Fecha_Control: true,
          },
          orderBy: { Fecha_Control: 'desc' },
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

    return {
      ...ausentismo,
      paciente,
      prestataria,
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
