import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import { Prisma } from '@medintt/database-medintt4';
import { DeclaracionJuradaService } from '../../medicina-laboral/declaracion-jurada/declaracion-jurada.service';
import { UpdatePacienteDto, PacienteDataDto } from './dto/update-paciente.dto';
import {
  verifySignedToken,
  TokenExpiredError,
} from '../../medicina-laboral/security/token.util';

import { ProofPayload } from '../../medicina-laboral/declaracion-jurada/dto/token-payloads.interface';

@Injectable()
export class PacientesService {
  constructor(
    private readonly prisma: PrismaMedinttService,
    private readonly ddjjService: DeclaracionJuradaService,
  ) {}

  private get proofSecret(): string {
    const secret = process.env.PROOF_SECRET;
    if (!secret) {
      throw new Error('PROOF_SECRET not configured');
    }
    return secret;
  }

  async update(dto: UpdatePacienteDto) {
    let payload: ProofPayload | null;
    try {
      payload = verifySignedToken<ProofPayload>(
        (dto as unknown as { proof: string }).proof,
        this.proofSecret,
        {
          throwOnExpired: true,
        },
      );

      if (!payload || payload.typ !== 'proof') {
        throw new UnauthorizedException('Invalid or expired proof token');
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token is expired');
      }
      throw new UnauthorizedException('Invalid token');
    }

    const ddjjId = payload.did;

    const dj = await this.prisma.declaraciones_Juradas.findUnique({
      where: { Id: ddjjId },
      include: { Pacientes: true },
    });

    if (!dj || !dj.Pacientes) {
      throw new NotFoundException('Declaración Jurada or Paciente not found');
    }

    const {
      Apellido,
      Nombre,
      NroDocumento,
      FechaNacimiento,
      Direccion,
      Barrio,
      Id_Localidad,
      Telefono,
      Email,
      Nacionalidad,
      CUIL,
      Genero,
    }: PacienteDataDto = dto.paciente;

    const updateData: Prisma.PacientesUpdateInput = {
      Apellido,
      Nombre,
      NroDocumento,
      FechaNacimiento: FechaNacimiento ? new Date(FechaNacimiento) : null,
      Direccion,
      Barrio,
      Id_Localidad,
      Telefono,
      Email,
      Nacionalidad: Nacionalidad ? Nacionalidad.toUpperCase() : undefined,
      CUIL,
      Genero,
    };

    // Remove undefined keys
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const updatedPaciente = await this.prisma.pacientes.update({
      where: { Id: dj.Id_Paciente as number },
      data: updateData,
    });

    return updatedPaciente;
  }
}
