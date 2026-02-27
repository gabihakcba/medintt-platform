import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaMedinttService } from 'src/prisma-medintt/prisma-medintt.service';
import { MailService } from '@medintt/mail';
import { InviteRequestDto } from './dto/invite-request.dto';
import {
  createSignedToken,
  verifySignedToken,
  nowUnix,
  nonceB64url,
  hashString,
  TokenExpiredError,
} from '../security/token.util';
import { VerifyRequestDto } from './dto/verify-request.dto';
import { GetFirmaDto } from './dto/get-firma.dto';
import { UpdateFirmaDto } from './dto/update-firma.dto';

interface InvitePayload {
  pid: number;
  typ: string;
  v: number;
  n: string;
  exp: number;
}

interface ProofPayload {
  pid: number;
  typ: string;
  v: number;
  n: string;
  exp: number;
  dnih: string;
}

@Injectable()
export class FirmaPacienteService {
  constructor(
    private prisma: PrismaMedinttService,
    private readonly mailService: MailService,
  ) {}

  private get inviteSecret(): string {
    const secret = process.env.INVITE_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('INVITE_SECRET not configured');
    }
    return secret;
  }

  private get proofSecret(): string {
    const secret = process.env.PROOF_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('PROOF_SECRET not configured');
    }
    return secret;
  }

  // --- Methods ---

  async createInvite(dto: InviteRequestDto) {
    const exists = await this.prisma.pacientes.findUnique({
      where: { Id: dto.pacienteId },
    });
    if (!exists) {
      throw new NotFoundException(
        `Paciente with ID ${dto.pacienteId} not found`,
      );
    }

    const now = nowUnix();
    const ttlMinutes = dto.ttlMinutes || 7 * 24 * 60; // Default 7 days
    const expiresAt = now + ttlMinutes * 60;

    const payload = {
      pid: dto.pacienteId,
      typ: 'invite-paciente',
      v: 1,
      n: nonceB64url(),
      exp: expiresAt,
    };

    const token = createSignedToken(payload, this.inviteSecret);
    // URL construction similar to DDJJ but for firma-paciente?
    // User didn't specify URL structure, but we return the token primarily.
    // We can assume a similar pattern /firma-paciente/:token if front exists.
    const baseUrl = process.env.FRONT_URL;
    const url = `${baseUrl}/${process.env.FIRMA_URL}/${token}`;

    return {
      token,
      url,
      expiresAt,
    };
  }

  getOrCreateInviteUrl(pacienteId: number): string {
    const now = nowUnix();
    const ttlMinutes = 7 * 24 * 60; // Default 7 days
    const expiresAt = now + ttlMinutes * 60;

    const payload = {
      pid: pacienteId,
      typ: 'invite-paciente',
      v: 1,
      n: nonceB64url(),
      exp: expiresAt,
    };

    const token = createSignedToken(payload, this.inviteSecret);
    const baseUrl = process.env.FRONT_URL;
    return `${baseUrl}/${process.env.FIRMA_URL}/${token}`;
  }

  async sendInviteEmail(pacienteId: number) {
    const paciente = await this.prisma.pacientes.findUnique({
      where: { Id: pacienteId },
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente with ID ${pacienteId} not found`);
    }

    if (!paciente.Email) {
      throw new Error('El paciente no tiene un correo electrónico registrado.');
    }

    const inviteUrl = this.getOrCreateInviteUrl(paciente.Id);
    await this.mailService.sendSignatureLinkMail(
      paciente.Email,
      `${paciente.Apellido}, ${paciente.Nombre}`,
      inviteUrl,
    );

    return { success: true };
  }

  async verifyIdentity(dto: VerifyRequestDto) {
    // 1. Verify Invite Token
    const invitePayload = verifySignedToken<InvitePayload>(
      dto.inviteToken,
      this.inviteSecret,
    );

    if (!invitePayload || invitePayload.typ !== 'invite-paciente') {
      throw new UnauthorizedException('Invalid or expired invitation link');
    }

    const pacienteId = invitePayload.pid;

    // 2. Validate Identity against DB
    const paciente = await this.prisma.pacientes.findUnique({
      where: { Id: pacienteId },
    });

    const genericError = new UnauthorizedException(
      'No pudimos validar los datos proporcionados.',
    );

    if (!paciente) {
      throw genericError;
    }

    // DNI Check
    if (paciente.NroDocumento !== dto.dni) {
      throw genericError;
    }

    // Optional Fecha Nacimiento Check
    if (dto.fechaNacimiento) {
      if (!paciente.FechaNacimiento) throw genericError;

      const dbDate = new Date(paciente.FechaNacimiento);
      const inputDate = new Date(dto.fechaNacimiento);
      if (
        dbDate.toISOString().slice(0, 10) !==
        inputDate.toISOString().slice(0, 10)
      ) {
        throw genericError;
      }
    }

    // 3. Generate Proof Token
    const now = nowUnix();
    const proofTtl = 15; // minutes
    const proofExpiresAt = now + proofTtl * 60;

    const proofPayload = {
      pid: pacienteId,
      typ: 'proof-paciente',
      v: 1,
      n: nonceB64url(),
      exp: proofExpiresAt,
      dnih: hashString(dto.dni),
    };

    const proof = createSignedToken(proofPayload, this.proofSecret);

    // 4. Return status
    const hasFirma =
      paciente.ImagenFirma !== null && paciente.ImagenFirma.length > 0;

    return {
      proof,
      proofExpiresAt,
      firma: hasFirma,
    };
  }

  private validateProof(proof: string): number {
    try {
      const payload = verifySignedToken<ProofPayload>(proof, this.proofSecret, {
        throwOnExpired: true,
      });

      if (!payload || payload.typ !== 'proof-paciente') {
        throw new UnauthorizedException('Invalid or expired proof token');
      }
      return payload.pid;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token is expired');
      }
      throw error;
    }
  }

  async getFirma(dto: GetFirmaDto) {
    const pacienteId = this.validateProof(dto.proof);

    const paciente = await this.prisma.pacientes.findUnique({
      where: { Id: pacienteId },
      select: { ImagenFirma: true },
    });

    if (!paciente || !paciente.ImagenFirma) {
      throw new NotFoundException('Firma no encontrada');
    }

    return {
      firma: Buffer.from(paciente.ImagenFirma).toString('base64'),
    };
  }

  async updateFirma(dto: UpdateFirmaDto) {
    const pacienteId = this.validateProof(dto.proof);

    const base64Data = dto.firma.replace(/^data:image\/\w+;base64,/, '');
    const firmaBuffer = Buffer.from(base64Data, 'base64');

    await this.prisma.pacientes.update({
      where: { Id: pacienteId },
      data: {
        ImagenFirma: firmaBuffer,
      },
    });

    return { success: true };
  }
}
