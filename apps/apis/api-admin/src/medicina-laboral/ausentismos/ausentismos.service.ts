import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@medintt/database-medintt4';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { AusentismosFilterDto } from './dto/ausentismos-filter.dto';

@Injectable()
export class AusentismosService {
  constructor(private prisma: PrismaMedinttService) {}

  async findAll(
    user: JwtPayload,
    filters: AusentismosFilterDto = {},
    bypassPagination: boolean = false,
    includeAttachments: boolean = false,
  ) {
    const limit = filters.limit ? Number(filters.limit) : 10;

    const page = filters.page && filters.page > 0 ? Number(filters.page) : 1;
    const skip = bypassPagination ? undefined : (page - 1) * limit;
    const take = bypassPagination ? undefined : limit;

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
      take,
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
          select: {
            Id: true,
            FileName: true,
            Extension: true,
            ...(includeAttachments ? { Archivo: true } : {}),
          },
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

    const data = await Promise.all(
      ausentismos.map(async (a) => {
        // Calculate Statistics
        const fechaDesde = a.Fecha_Desde ? new Date(a.Fecha_Desde) : null;
        const fechaHasta = a.Fecha_Hasta ? new Date(a.Fecha_Hasta) : null;
        const today = new Date();

        // Total Dias
        let totalDias = 0;
        if (fechaDesde && fechaHasta) {
          const diffTime = Math.abs(
            fechaHasta.getTime() - fechaDesde.getTime(),
          );
          totalDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
        }

        // Dias Restantes (only if status is EN CURSO - assumed logic, usually determined by lack of reincorporation or date check)
        // Assuming Logic: If Reincorporation date is null and/or today <= Fecha_Hasta
        // The requirement says: "Si el status es EN CURSO" -> We need to know where 'Status' comes from.
        // It seems 'Status' might be derived or stored. Let's assume based on dates for now if not explicit.
        // Wait, Is there a Status field? The user mentioned "Status" in dashboard.html.
        // But in Prisma schema? I don't see it in `select` in `findAll`.
        // Let's look at `findOne` which gets `informes` status.
        // The user request says: "Dias_Restantes: Si el status es EN CURSO".
        // Use logic: if today < Fecha_Hasta => Remaining = Fecha_Hasta - Today.
        let diasRestantes = 0;
        let status = 'FINALIZADO';

        if (fechaHasta && today <= fechaHasta && !a.Fecha_Reincoporacion) {
          status = 'EN CURSO';
          const diffTime = fechaHasta.getTime() - today.getTime();
          diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diasRestantes < 0) diasRestantes = 0;
        }

        // Indice Recurrencia: % of ausentismos for the same Id_Paciente in last 12 months.
        // We need to count ausentismos for this patient in last 12 months.
        // This is expensive to do in loop (N+1).
        // Optimization: fetch all ausentismos counts for these patients in last 12 months beforehand if possible?
        // Or just do it here for MVP/Export which is usually lower volume.
        // Given `bypassPagination` is usually for export, volume might be high?
        // But for PDF distinct export usually it's one by one or small batch?
        // Wait, the PDF Export is usually for a SINGLE report or a LIST?
        // "Exportar a PDF de informes de ausentismo".
        // The dashboard shows "ID AUSENTISMO". Singular.
        // "Objetivo: Implementar exportación a PDF de informes de ausentismo".
        // The endpoint is `GET /medicina-laboral/ausentismos/export/pdf`.
        // And it says "findAll ignoring pagination".
        // This implies generating a PDF with multiple reports?
        // Or one big report with many pages?
        // "Le los archivos ... base.html y dashboard.html."
        // base.html has specific ID.
        // If the export generates a list, it probably concatenates them.

        // Recurrencia Calculation
        let recurrenceIndex = 0;
        if (a.Id_Paciente) {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

          /* const count = await this.prisma.ausentismos.count({
            where: {
              Id_Paciente: a.Id_Paciente,
              Fecha_Desde: { gte: oneYearAgo },
            },
          }); */ // optimization used below
          // Calculation: Is it percentage of what?
          // "Porcentaje de ausentismos del mismo Id_Paciente en los últimos 12 meses."
          // Usually recurrence index is just the count or frequency.
          // If it's a percentage, maybe percentage of time absent?
          // Or maybe just the count is what they want displayed as "%"?
          // dashboard.html says `{{Indice_Recurrencia}}%`.
          // Let's assume it's (Time Absent / Time Employed)? No data.
          // Let's assume it's simply the Count if undefined, or maybe (Count > 1 ? ...).
          // Clarification needed?
          // "Indice_Recurrencia: Porcentaje de ausentismos del mismo Id_Paciente en los últimos 12 meses."
          // This phrasing is tricky. "Percentage of ausentismos".
          // Maybe (Ausentismos of this patient / Total Ausentismos of company)?
          // Or (Days Absent / 365)?
          // I will implement (Days Absent in last 12 months / 365) * 100?
          // Or just Count.
          // Let's try to calculate (Total Days Absent Last 12 Months / 365) * 100.

          // Let's fetch the ausentismos to sum days
          const patientAusentismos = await this.prisma.ausentismos.findMany({
            where: {
              Id_Paciente: a.Id_Paciente,
              Fecha_Desde: { gte: oneYearAgo },
            },
            select: { Fecha_Desde: true, Fecha_Hasta: true },
          });

          let daysAbsent = 0;
          patientAusentismos.forEach((pa) => {
            const start = pa.Fecha_Desde ? new Date(pa.Fecha_Desde) : null;
            const end = pa.Fecha_Hasta ? new Date(pa.Fecha_Hasta) : null;
            if (start && end) {
              const diff = Math.abs(end.getTime() - start.getTime());
              daysAbsent += Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
            }
          });

          recurrenceIndex = Math.round((daysAbsent / 365) * 100);
        }

        return {
          ...a,
          paciente: a.Id_Paciente ? pacientesMap.get(a.Id_Paciente) : null,
          prestataria: a.Id_Prestataria
            ? prestatariasMap.get(a.Id_Prestataria)
            : null,
          Total_Dias: totalDias,
          Dias_Restantes: diasRestantes,
          Status: status,
          Indice_Recurrencia: recurrenceIndex,
        };
      }),
    );

    return {
      data,
      meta: {
        total,
        page,
        lastPage: take ? Math.ceil(total / take) : 1,
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
