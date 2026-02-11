import { Injectable } from '@nestjs/common';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import { Prisma } from '@medintt/database-medintt4';

@Injectable()
export class EmailsService {
  constructor(private prisma: PrismaMedinttService) {}

  async getEmpresasEmails() {
    return this.getEmailsByTipo('EMPRESA');
  }

  async getArtEmails() {
    return this.getEmailsByTipo('ART');
  }

  private async getEmailsByTipo(tipo: string) {
    const prestatarias = await this.prisma.prestatarias.findMany({
      where: {
        Tipo: tipo,
      },
      select: {
        Id: true,
        Tipo: true,
        Nombre: true,
        Email_HistoriasClinicas: true,
        Email_PedidosQuirurgicos: true,
        MailCobranzas: true,
      },
    });

    return prestatarias.map((prestataria) => {
      const rawEmails = [
        ...(prestataria.Email_HistoriasClinicas?.split(',') ?? []),
        ...(prestataria.Email_PedidosQuirurgicos?.split(',') ?? []),
        ...(prestataria.MailCobranzas?.split(',') ?? []),
      ];

      const emails = rawEmails
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      const uniqueEmails = [...new Set(emails)];

      return {
        Id: prestataria.Id,
        Tipo: prestataria.Tipo,
        Nombre: prestataria.Nombre,
        emails: uniqueEmails,
      };
    });
  }

  async getPacientesEmails(filters: {
    desde?: string;
    hasta?: string;
    profesionalId?: string;
  }) {
    const { desde, hasta, profesionalId } = filters;

    const where: Prisma.PacientesWhereInput = {};

    if (desde && hasta && profesionalId) {
      where.Cirugias = {
        some: {
          FechaEstimada: {
            gte: new Date(desde),
            lte: new Date(hasta),
          },
          Id_Profesional: Number(profesionalId),
        },
      };
    }

    const pacientes = await this.prisma.pacientes.findMany({
      where,
      select: {
        Id: true,
        Codigo: true,
        Nombre: true,
        Apellido: true,
        NroDocumento: true,
        Email: true,
        FamRespo_Email: true,
      },
      distinct: ['Id'],
    });

    return pacientes.map((paciente) => {
      const rawEmails = [
        ...(paciente.Email?.split(',') ?? []),
        ...(paciente.FamRespo_Email?.split(',') ?? []),
      ];

      const emails = rawEmails
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      const uniqueEmails = [...new Set(emails)];

      return {
        Id: paciente.Id,
        Nombre: paciente.Nombre,
        Apellido: paciente.Apellido,
        NroDocumento: paciente.NroDocumento,
        emails: uniqueEmails,
      };
    });
  }
}
