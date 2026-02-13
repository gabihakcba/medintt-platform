import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import type { JwtPayload } from '../../common/types/jwt-payload.type';

@Injectable()
export class ExamenesLaboralesService {
  constructor(private prisma: PrismaMedinttService) {}

  async findAll(user: JwtPayload, pacienteId?: number) {
    const medLabProject = process.env.MED_LAB_PROJECT;
    const roleAdmin = process.env.ROLE_ADMIN;
    const orgM = process.env.ORG_M;

    const membership = user.permissions?.[medLabProject!];
    const isSuperAdminOrAdmin =
      user.isSuperAdmin ||
      (membership?.role === roleAdmin && membership?.organizationCode === orgM);

    let prestatariaId: number | undefined;

    if (!isSuperAdminOrAdmin) {
      const organizationCode = membership?.organizationCode;
      if (!organizationCode) return []; // Should not happen if guarded correctly

      const prestataria = await this.prisma.prestatarias.findFirst({
        where: { Codigo: organizationCode },
        select: { Id: true },
      });

      if (!prestataria) return [];
      prestatariaId = prestataria.Id;
    }

    const where: {
      Examenes_Laborales?: { Id_Prestataria: number };
      Id_Paciente?: number;
    } = {};

    if (prestatariaId) {
      // Filter by Prestataria via Examenes_Laborales
      where.Examenes_Laborales = {
        Id_Prestataria: prestatariaId,
      };
    }

    if (pacienteId) {
      where.Id_Paciente = pacienteId;
    }

    const examenesPacientes =
      await this.prisma.examenes_Laborales_Pacientes.findMany({
        where,
        select: {
          Id: true,
          Id_Examen_Laboral: true,
          Id_Paciente: true,
          Fecha_Alta: true,
          Status: true,
          Examenes_Laborales: {
            select: {
              Id: true,
              Status: true,
              Fecha_Alta: true,
              Prestatarias: {
                select: { Nombre: true },
              },
              Examenes: {
                select: { Titulo: true, Examen: true, Codigo: true },
              },
            },
          },
          Examenes_Laborales_PacientesxPracticas: {
            select: {
              Id: true,
              Practicas: {
                select: {
                  Id: true,
                  Id_Codigo_Valorizacion: true,
                  Fecha_Practica: true,
                  Status: true,
                  Semaforo: true,
                  Autorizacion: true,
                  Practicas_Attachs: {
                    select: {
                      Id: true,
                      FileName: true,
                      Extension: true,
                      Descripcion: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { Fecha_Alta: 'desc' },
      });

    // Need to enrich with Codigos_Valorizacion description because Practicas relation is tricky in schema
    // In schema: Practicas -> Id_Codigo_Valorizacion -> Codigos_Valorizacion

    // Let's optimize the query above.
    // The previous attempt at nested relation for Codigos_Valorizacion was wrong based on schema provided earlier.
    // Schema: Practicas has Id_Codigo_Valorizacion.
    // However, Prisma relation might be named differently or not generated if I don't see it in schema clearly on 'Practicas' model description I read.
    // Re-reading Schema for Practicas (lines 1057-1084):
    // It has `Id_Codigo_Valorizacion Int?` but NO `@relation` to `Codigos_Valorizacion` defined in the model provided in view_file output!
    // Wait, let me check `Codigos_Valorizacion` model (lines 365-379). It has `Examenes_Codigos_Valorizacion`, `Praxis_Usuarios`, etc.
    // But `Practicas` model does NOT have a relation field to `Codigos_Valorizacion`.
    // It has `Id_Codigo_Valorizacion` integer field but no relation object.
    // This means I cannot `include` it directly. I have to fetch it manually.

    // Correction:
    // I will fetch the exams first.
    // Then extract all `Id_Codigo_Valorizacion` from the practices.
    // Then fetch `Codigos_Valorizacion` where In IDs.
    // Then map them back.

    // Let's re-write the findMany to strictly get what's available and then enrich.

    // Actually, looking at `Practicas` (1057), it has:
    // Id_Codigo_Valorizacion Int?
    // But NO relation property.
    // This is strange for Prisma, usually there is a relation.
    // Let me check if I missed it.
    // Line 1060: Id_Codigo_Valorizacion Int?
    // Line 1081-1083: Examenes_Laborales_PacientesxPracticas, HC_Practicas, Practicas_Attachs.
    // No `Codigos_Valorizacion` relation.

    // Okay, manual fetch it is.

    const enrichedExams = await Promise.all(
      examenesPacientes.map(async (ep) => {
        // Fetch patient (if not already fetched - I didn't include it above to keep initial query distinct)
        const paciente = await this.prisma.pacientes.findUnique({
          where: { Id: ep.Id_Paciente! },
          select: {
            Id: true,
            Nombre: true,
            Apellido: true,
            NroDocumento: true,
          },
        });

        // Process practices
        const practicas = await Promise.all(
          ep.Examenes_Laborales_PacientesxPracticas.map(async (pp) => {
            const practica = pp.Practicas;
            if (!practica) return null;

            let codigoDescripcion = 'Sin Descripción';
            if (practica.Id_Codigo_Valorizacion) {
              const codigo = await this.prisma.codigos_Valorizacion.findUnique({
                where: { Id: Number(practica.Id_Codigo_Valorizacion) },
              });
              if (codigo)
                codigoDescripcion =
                  codigo.Descripcion || codigo.Codigo || 'Sin Descripción';
            }

            return {
              ...practica,
              Descripcion: codigoDescripcion,
            };
          }),
        );

        return {
          ...ep,
          Paciente: paciente,
          Practicas: practicas.filter((p) => p !== null),
        };
      }),
    );

    return enrichedExams;
  }

  async getAttachment(id: number) {
    const attachment = await this.prisma.practicas_Attachs.findUnique({
      where: { Id: id },
    });

    if (!attachment || !attachment.Archivo) {
      throw new NotFoundException('Attachment not found');
    }

    return {
      buffer: attachment.Archivo,
      mimeType: this.getMimeType(attachment.Extension),
      fileName: attachment.FileName,
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
