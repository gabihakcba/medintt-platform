import { Injectable } from '@nestjs/common';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import { JwtPayload } from '../../common/types/jwt-payload.type';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaMedinttService) {}

  async findAll(user: JwtPayload) {
    // If SuperAdmin or Admin of medicina-laboral in medintt org, return all patients
    const medLabProject = process.env.MED_LAB_PROJECT;
    const roleAdmin = process.env.ROLE_ADMIN;
    const orgM = process.env.ORG_M;

    const membership = user.permissions?.[medLabProject!];
    const isAdmin =
      membership?.role === roleAdmin && membership?.organizationCode === orgM;

    if (user.isSuperAdmin || isAdmin) {
      // Return all patients
      const patients = await this.prisma.pacientes.findMany({
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
        },
      });

      // Enrich with Prestatarias manually since relation might not exist in Prisma schema
      const patientIds = patients.map((p) => p.Id);

      const afiliaciones = await this.prisma.afiliacion_Pacientes.findMany({
        where: { Id_Paciente: { in: patientIds } },
        select: {
          Id_Paciente: true,
          Id_Prestataria: true,
        },
      });

      // Get unique Prestataria IDs
      const prestatariaIds = [
        ...new Set(
          afiliaciones
            .map((a) => a.Id_Prestataria)
            .filter((id): id is number => id !== null),
        ),
      ];

      // Fetch Prestatarias details
      const prestatariasInfos = await this.prisma.prestatarias.findMany({
        where: { Id: { in: prestatariaIds } },
        select: { Id: true, Nombre: true },
      });

      const prestatariaMap = new Map(prestatariasInfos.map((p) => [p.Id, p]));

      // Map unique Prestatarias per patient
      const patientPrestatariasMap = new Map<
        number,
        (typeof prestatariasInfos)[number][]
      >();

      afiliaciones.forEach((af) => {
        if (af.Id_Paciente && af.Id_Prestataria) {
          const pInfo = prestatariaMap.get(af.Id_Prestataria);
          if (pInfo) {
            const list = patientPrestatariasMap.get(af.Id_Paciente) || [];
            // Avoid duplicates for same patient
            if (!list.find((existing) => existing.Id === pInfo.Id)) {
              list.push(pInfo);
            }
            patientPrestatariasMap.set(af.Id_Paciente, list);
          }
        }
      });

      return patients.map((p) => ({
        ...p,
        prestatarias: patientPrestatariasMap.get(p.Id) || [],
      }));
    }

    // If Interlocutor, return only patients from their organization
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
        Nombre: true,
      },
    });

    if (!prestataria) {
      // Organization not found in Prestatarias table
      return [];
    }
    // Find patient IDs affiliated with this organization through Afiliacion_Pacientes
    const afiliaciones = await this.prisma.afiliacion_Pacientes.findMany({
      where: {
        Id_Prestataria: prestataria.Id,
      },
      select: {
        Id_Paciente: true,
      },
    });

    const patientIds = afiliaciones
      .map((a) => a.Id_Paciente)
      .filter((id): id is number => id !== null);

    // Return patients that match these IDs
    const patients = await this.prisma.pacientes.findMany({
      where: {
        Id: {
          in: patientIds,
        },
        // Activo: -1,
      },
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
      },
    });

    return patients.map((p) => ({
      ...p,
      prestatarias: [prestataria], // We know they belong to this one
    }));
  }
}
