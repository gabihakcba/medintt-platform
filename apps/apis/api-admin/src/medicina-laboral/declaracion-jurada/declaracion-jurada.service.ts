/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@medintt/database-medintt4';
import { PrismaMedinttService } from '../../prisma-medintt/prisma-medintt.service';
import { FirmaPacienteService } from '../firma-paciente/firma-paciente.service';
import { InviteRequestDto } from './dto/invite-request.dto';
import { InviteResponseDto } from './dto/invite-response.dto';
import { TokenExpiredError } from '@nestjs/jwt';
import * as path from 'path';
import {
  nowUnix,
  nonceB64url,
  createSignedToken,
  verifySignedToken,
  hashString,
} from '../security/token.util';
import { DeclaracionJuradaResponse } from './dto/declaracion-jurada.response';
import { GetDeclaracionBodyDto } from './dto/get-declaracion-body.dto';
import { GetDeclaracionResponse } from './dto/get-declaracion.response';
import { UpdateDeclaracionDto } from './dto/update-declaracion.dto';
import { VerifyRequestDto } from './dto/verify-request.dto';
import { VerifyResponseDto } from './dto/verify-response.dto';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { now, formatDate } from '@medintt/utils';

// Type for DeclaracionJurada with Paciente included
type DeclaracionJuradaWithPaciente = Prisma.Declaraciones_JuradasGetPayload<{
  include: { Pacientes: true };
}>;

// Token payload types
interface InvitePayload {
  did: number;
  typ: 'invite';
  v: number;
  n: string;
  exp: number;
}

interface ProofPayload {
  did: number;
  typ: 'proof';
  v: number;
  n: string;
  exp: number;
  dnih: string;
}

interface ExamenLaboralQueryResult {
  Id_Examen_Laboral: number | null;
}

@Injectable()
export class DeclaracionJuradaService {
  constructor(
    private prisma: PrismaMedinttService,
    private readonly firmaPacienteService: FirmaPacienteService,
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

  // --- New Stateless Flow ---

  async createInvite(dto: InviteRequestDto): Promise<InviteResponseDto> {
    // Check if DDJJ exists strictly? Or assume ID is correct?
    // Good practice: check existence to fail early.
    const exists = await this.prisma.declaraciones_Juradas.findUnique({
      where: { Id: dto.ddjjId },
    });
    if (!exists) {
      throw new NotFoundException(
        `DeclaracionJurada with ID ${dto.ddjjId} not found`,
      );
    }

    const now = nowUnix();
    const ttlMinutes = dto.ttlMinutes || 7 * 24 * 60; // Default 7 days
    const expiresAt = now + ttlMinutes * 60;

    const payload = {
      did: dto.ddjjId,
      typ: 'invite',
      v: 1,
      n: nonceB64url(),
      exp: expiresAt,
    };

    const token = createSignedToken(payload, this.inviteSecret);
    const baseUrl = process.env.FRONT_URL;
    const url = `${baseUrl}/${process.env.DD_JJ_URL}/${token}`;

    return {
      token,
      url,
      expiresAt,
    };
  }

  async verifyIdentity(dto: VerifyRequestDto): Promise<VerifyResponseDto> {
    // 1. Verify Invite Token
    const invitePayload = verifySignedToken<InvitePayload>(
      dto.inviteToken,
      this.inviteSecret,
    );

    if (!invitePayload || invitePayload.typ !== 'invite') {
      throw new UnauthorizedException('Invalid or expired invitation link');
    }

    const ddjjId = invitePayload.did;
    // 2. Validate Identity against DB (Logic similar to legacy verifyDni)
    // We do NOT trust the token blindly, we check DB state.
    const dj = await this.prisma.declaraciones_Juradas.findUnique({
      where: { Id: ddjjId },
      include: {
        Pacientes: true,
      },
    });

    // Generic error to avoid leaking data existence
    const genericError = new UnauthorizedException(
      'No pudimos validar los datos proporcionados.',
    );

    if (!dj || !dj.Pacientes) {
      throw genericError;
    }

    // DNI Check
    if (dj.Pacientes.NroDocumento !== dto.dni) {
      throw genericError;
    }

    // Optional Fecha Nacimiento Check
    if (dto.fechaNacimiento && dj.Pacientes.FechaNacimiento) {
      // Check if dates match. Careful with format/timezones.
      // Assuming DB stores Date or String 'YYYY-MM-DD'. Pacientes.FechaNacimiento type is likely Date or string.
      // Let's assume generic check.
      const dbDate = new Date(dj.Pacientes.FechaNacimiento);
      const inputDate = new Date(dto.fechaNacimiento);
      // Compare simple ISO string or just loose check?
      // Better: strict check if provided.
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
      did: ddjjId,
      typ: 'proof',
      v: 1,
      n: nonceB64url(),
      exp: proofExpiresAt,
      dnih: hashString(dto.dni),
    };

    const proof = createSignedToken(proofPayload, this.proofSecret);

    // 4. Return full data (GetDeclaracionResponse format)
    let empresaData;
    if (dj.Id_empresa) {
      const empresa = await this.prisma.prestatarias.findUnique({
        where: { Id: dj.Id_empresa },
      });
      if (empresa) {
        empresaData = {
          Nombre: empresa.Nombre,
          Direccion: empresa.Direccion,
        };
      } else {
        empresaData = null;
      }
    }

    const { Pacientes, ...declaracionContent } = dj;

    const hasFirma = Pacientes.ImagenFirma && Pacientes.ImagenFirma.length > 0;
    let firmaUrl = '';

    if (!hasFirma) {
      firmaUrl = this.firmaPacienteService.getOrCreateInviteUrl(Pacientes.Id);
    }

    return {
      proof,
      proofExpiresAt,
      ddjj: {
        declaracion: declaracionContent as unknown as DeclaracionJuradaResponse,
        paciente: {
          Nombre: Pacientes.Nombre as string,
          Apellido: Pacientes.Apellido as string,
          NroDocumento: Pacientes.NroDocumento as string,
          FechaNacimiento: Pacientes.FechaNacimiento as Date,
          Direccion: Pacientes.Direccion as string,
          Genero: Pacientes.Genero as string,
          firma: hasFirma
            ? Buffer.from(Pacientes.ImagenFirma!).toString('base64')
            : null,
          firmaUrl,
        },
        empresa: empresaData,
      },
    };
  }

  // Helper to validate proof and get DDJJ ID
  private validateProof(proof: string): number {
    try {
      const payload = verifySignedToken<ProofPayload>(proof, this.proofSecret, {
        throwOnExpired: true,
      });

      if (!payload || payload.typ !== 'proof') {
        throw new UnauthorizedException('Invalid or expired proof token');
      }
      return payload.did;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token is expired');
      }
      throw error;
    }
  }

  async getByProof(
    dto: GetDeclaracionBodyDto,
  ): Promise<GetDeclaracionResponse> {
    const ddjjId = this.validateProof(dto.proof);

    // Reuse existing get logic logic but adapted
    // We don't have the DNI in cleartext anymore, but we have the ID.
    // The existing 'getDeclaracion' requires DNI check.
    // Here verification is done via proof.

    const dj = await this.prisma.declaraciones_Juradas.findUnique({
      where: { Id: ddjjId },
      include: {
        Pacientes: true,
      },
    });

    if (!dj || !dj.Pacientes) {
      throw new NotFoundException('Declaracion Jurada not found');
    }

    let empresaData;
    if (dj.Id_empresa) {
      const empresa = await this.prisma.prestatarias.findUnique({
        where: { Id: dj.Id_empresa },
      });
      if (empresa) {
        empresaData = {
          Nombre: empresa.Nombre,
          Direccion: empresa.Direccion,
        };
      }
    }

    const { Pacientes, ...declaracion } = dj;

    return {
      declaracion: declaracion as DeclaracionJuradaResponse,
      paciente: {
        Nombre: Pacientes.Nombre as string,
        Apellido: Pacientes.Apellido as string,
        NroDocumento: Pacientes.NroDocumento as string,
        FechaNacimiento: Pacientes.FechaNacimiento as Date,
        Direccion: Pacientes.Direccion as string,
        Genero: Pacientes.Genero as string,
        Barrio: Pacientes.Barrio as string,
        Id_Localidad: Pacientes.Id_Localidad as number,
      },
      empresa: empresaData,
    };
  }

  async updateByProof(proof: string, dto: UpdateDeclaracionDto) {
    const ddjjId = this.validateProof(proof);

    // Reuse existing update logic mostly
    const dj = await this.prisma.declaraciones_Juradas.findUnique({
      where: { Id: ddjjId },
      include: { Pacientes: true },
    });

    if (!dj) {
      throw new NotFoundException('Declaracion Jurada not found');
    }

    if (dj.Status === 'TERMINADO') {
      throw new ConflictException('DDJJ already updated');
    }

    if (
      !dj.Pacientes ||
      !dj.Pacientes.ImagenFirma ||
      dj.Pacientes.ImagenFirma.length === 0
    ) {
      const firmaUrl = this.firmaPacienteService.getOrCreateInviteUrl(
        dj.Id_Paciente as number,
      );
      throw new ConflictException({
        message: 'Firma no cargada',
        firmaUrl,
      });
    }

    let genderToSave = dj.Genero;
    if (dj.Pacientes && dj.Pacientes.Genero) {
      genderToSave = dj.Pacientes.Genero;
    }

    const updateData = {
      ...dto,
      Fecha: new Date(),
      Genero: genderToSave,
      Fecha_Ultima_Menstruacion:
        dto.Fecha_Ultima_Menstruacion ?? new Date('1900-01-01'),
      Status: 'TERMINADO',
    };

    // Prepare Company Name
    let nombreEmpresa = 'MEDINTT - EMPRESA CLIENTE';
    if (dj.Id_empresa) {
      const empresa = await this.prisma.prestatarias.findUnique({
        where: { Id: dj.Id_empresa },
      });
      if (empresa && empresa.Nombre) {
        nombreEmpresa = empresa.Nombre;
      }
    }

    const nombreUsuario = 'SISTEMA_WEB';

    return this.prisma.$transaction(async (tx) => {
      const updatedDj = await tx.declaraciones_Juradas.update({
        where: { Id: ddjjId },
        data: updateData,
        include: { Pacientes: true },
      });

      // Generate PDF Buffer
      const pdfBuffer = await this.generatePdfBuffer(updatedDj, nombreEmpresa);

      if (dj.Id_Practica) {
        // Use shared date utilities
        const nowMoment = now();
        const formattedDate = nowMoment.format('YYYY-MM-DD_HHmmss');
        const niceDate = nowMoment.format('DD/MM/YYYY HH:mm');

        // Patient data for description
        const pacienteNombre = `${updatedDj.Pacientes?.Apellido} ${updatedDj.Pacientes?.Nombre}`;
        const pacienteDni = updatedDj.Pacientes?.NroDocumento || 'S/D';

        // Save PDF to Practicas_Attachs
        await tx.practicas_Attachs.create({
          data: {
            Id_Practica: dj.Id_Practica,
            FileName: `DDJJ_${pacienteDni}_${formattedDate}`,
            FileSize: Math.round(pdfBuffer.length / 1024), // Size in KB
            Descripcion: `DECLARACIÓN JURADA DE: ${pacienteNombre.toUpperCase()} ${pacienteDni}`,
            Observaciones: `Declaración Jurada digital generada el ${niceDate}, por el usuario ${nombreUsuario}, para la empresa ${nombreEmpresa.toUpperCase()}`,
            Extension: '.pdf',
            Archivo: pdfBuffer,
          },
        });

        await tx.practicas.update({
          where: { Id: dj.Id_Practica },
          data: {
            Status: 'INFORMADA',
            Fecha_Practica: new Date(),
            InformeProfesional: `DECLARACION JURADA COMPLETADA EL ${formattedDate}`,
            Notas: 'Declaración jurada registrada en web y PDF adjunto.',
          },
        });

        // Update Labor Exam Status via SP
        // Fetch ID using raw SQL as safely requested by user
        const result: ExamenLaboralQueryResult[] = await tx.$queryRaw`
          SELECT        dbo.Examenes_Laborales_Pacientes.Id_Examen_Laboral
          FROM            dbo.Practicas LEFT OUTER JOIN
                                   dbo.Examenes_Laborales_PacientesxPracticas ON dbo.Practicas.Id = dbo.Examenes_Laborales_PacientesxPracticas.Id_Practica LEFT OUTER JOIN
                                   dbo.Examenes_Laborales_Pacientes ON dbo.Examenes_Laborales_PacientesxPracticas.Id_Examen_Laboral_Paciente = dbo.Examenes_Laborales_Pacientes.Id
          WHERE        (dbo.Practicas.Id = ${dj.Id_Practica})
        `;

        if (result && result.length > 0 && result[0].Id_Examen_Laboral) {
          const idExamenLaboral = result[0].Id_Examen_Laboral;
          await tx.$executeRaw`EXEC usp_Actualizar_Status_Examen_Laboral @Id_Examen_Laboral=${idExamenLaboral}`;
        }
      }

      return updatedDj;
    });
  }

  // --- PDF GENERATION LOGIC WITH PUPPETEER & HANDLEBARS ---
  private async generatePdfBuffer(
    dj: DeclaracionJuradaWithPaciente,
    empresa: string,
  ): Promise<Buffer> {
    const paciente = dj.Pacientes;

    // Fetch Localidad and Provincia
    let localidad = '';
    let provincia = '';
    if (paciente?.Id_Localidad) {
      const loc = await this.prisma.localidades.findUnique({
        where: { Id: paciente.Id_Localidad },
      });
      if (loc) {
        localidad = loc.Localidad || '';
        if (loc.Id_Provincia) {
          const prov = await this.prisma.provincias.findUnique({
            where: { Id: loc.Id_Provincia },
          });
          if (prov) {
            provincia = prov.Provincia || '';
          }
        }
      }
    }

    // 1. Prepare Data for Template
    const logoPath = path.resolve(__dirname, '..', 'pdfs', 'footer-logo.png');
    const logoFooter = fs.existsSync(logoPath)
      ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`
      : null;
    const itemsClinicos = [
      {
        nombre: 'Mareos/Desmayos',
        valor: dj.Mareos_Desmayos === 1,
        aclaracion: dj.Mareos_Desmayos_Aclaraciones,
      },
      {
        nombre: '¿Se realizó análisis HIV?',
        valor: dj.Analisis_HIV === 1,
        aclaracion: dj.Analisis_HIV_Aclaraciones,
      },
      {
        nombre: 'Convulsiones',
        valor: dj.Convulsiones === 1,
        aclaracion: dj.Convulsiones_Aclaraciones,
      },
      {
        nombre: 'Asma, Tos crónica',
        valor: dj.Asma_Tos_Cronica === 1,
        aclaracion: dj.Asma_Tos_Cronica_Aclaraciones,
      },
      {
        nombre: 'Epilepsia',
        valor: dj.Epilepsia === 1,
        aclaracion: dj.Epilepsia_Aclaraciones,
      },
      {
        nombre: 'Neumonía',
        valor: dj.Neumonia === 1,
        aclaracion: dj.Neumonia_Aclaraciones,
      },
      {
        nombre: 'Depresión',
        valor: dj.Depresion === 1,
        aclaracion: dj.Depresion_Aclaraciones,
      },
      {
        nombre: 'Sangre al escupir',
        valor: dj.Sangre_al_Escupir === 1,
        aclaracion: dj.Sangre_al_Escupir_Aclaraciones,
      },
      {
        nombre: 'Enfermedad neurológica',
        valor: dj.Enfermedad_Neurologica === 1,
        aclaracion: dj.Enfermedad_Neurologica_Aclaraciones,
      },
      {
        nombre: 'Celiaquía',
        valor: dj.Celiaquia === 1,
        aclaracion: dj.Celiaquia_Aclaraciones,
      },
      {
        nombre: 'Diabetes',
        valor: dj.Diabetes === 1,
        aclaracion: dj.Diabetes_Aclaraciones,
      },
      {
        nombre: 'Hernias - especifique',
        valor: dj.Hernias === 1,
        aclaracion: dj.Hernias_Aclaraciones,
      },
      {
        nombre: 'Dolor frec. de cabeza',
        valor: dj.Dolor_Frecuente_de_Cabeza === 1,
        aclaracion: dj.Dolor_Frecuente_de_Cabeza_Aclaraciones,
      },
      {
        nombre: 'Tratamiento psiquiátrico',
        valor: dj.Tratamiento_Psiquiatrico === 1,
        aclaracion: dj.Tratamiento_Psiquiatrico_Aclaraciones,
      },
      {
        nombre: 'Toma medicación ¿Cuál?',
        valor: dj.Toma_Medicacion === 1,
        aclaracion: dj.Toma_Medicacion_Aclaraciones,
      },
      {
        nombre: 'Fracturas (huesos afectados)',
        valor: dj.Fracturas === 1,
        aclaracion: dj.Fracturas_Aclaraciones,
      },
      {
        nombre: 'Hipertensión arterial',
        valor: dj.Hipertension_Arterial === 1,
        aclaracion: dj.Hipertension_Arterial_Aclaraciones,
      },
      {
        nombre: 'Lumbalgia',
        valor: dj.Lumbalgia === 1,
        aclaracion: dj.Lumbalgia_Aclaraciones,
      },
      {
        nombre: 'Cardiopatías',
        valor: dj.Cardiopatias === 1,
        aclaracion: dj.Cardiopatias_Aclaraciones,
      },
      {
        nombre: 'Problema renal/urinario',
        valor: dj.Problema_Renal_Urinario === 1,
        aclaracion: dj.Problema_Renal_Urinario_Aclaraciones,
      },
      {
        nombre: 'Varices',
        valor: dj.Varices === 1,
        aclaracion: dj.Varices_Aclaraciones,
      },
      {
        nombre: 'Amputaciones - especifique',
        valor: dj.Amputaciones === 1,
        aclaracion: dj.Amputaciones_Aclaraciones,
      },
      {
        nombre: 'Chagas',
        valor: dj.Chagas === 1,
        aclaracion: dj.Chagas_Aclaraciones,
      },
      {
        nombre: 'Limitaciones funcionales',
        valor: dj.Limitaciones_Funcionales === 1,
        aclaracion: dj.Limitaciones_Funcionales_Aclaraciones,
      },
      {
        nombre: 'Dentadura sana',
        valor: dj.Dentadura_Sana === 1,
        aclaracion: dj.Dentadura_Sana_Aclaraciones,
      },
      {
        nombre: 'Traumatismo y lesiones- especifique',
        valor: dj.Traumatismos_Lesiones === 1,
        aclaracion: dj.Traumatismos_Lesiones_Aclaraciones,
      },
      {
        nombre: 'Alergia - especifique',
        valor: dj.Alergias === 1,
        aclaracion: dj.Alergias_Aclaraciones,
      },
      {
        nombre: 'Enfermedades oculares',
        valor: dj.Enfermedades_Oculares === 1,
        aclaracion: dj.Enfermedades_Oculares_Aclaraciones,
      },
      {
        nombre: 'Tumor/cáncer espec.',
        valor: dj.Tumor_Cancer === 1,
        aclaracion: dj.Tumor_Cancer_Aclaraciones,
      },
      {
        nombre: 'Uso de lentes, Motivos',
        valor: dj.Uso_de_Lentes === 1,
        aclaracion: dj.Uso_de_Lentes_Aclaraciones,
      },
      {
        nombre: 'Hepatitis',
        valor: dj.Hepatitis === 1,
        aclaracion: dj.Hepatitis_Aclaraciones,
      },
      {
        nombre: 'Úlcera gástrica, Náuseas, vómitos',
        valor: dj.Ulcera_Gastrica_Nauseas_Vomitos === 1,
        aclaracion: dj.Ulcera_Gastrica_Nauseas_Vomitos_Aclaraciones,
      },
      {
        nombre: 'Disminución auditiva',
        valor: dj.Disminucion_Auditiva === 1,
        aclaracion: dj.Disminucion_Auditiva_Aclaraciones,
      },
      {
        nombre: 'Cirugías, ¿cuáles?',
        valor: dj.Cirugias === 1,
        aclaracion: dj.Cirugias_Aclaraciones,
      },
      {
        nombre: 'Tratamiento de tiroides',
        valor: dj.Tratamiento_Tiroides === 1,
        aclaracion: dj.Tratamiento_Tiroides_Aclaraciones,
      },
      {
        nombre: 'internaciones, motivos.',
        valor: dj.Internaciones === 1,
        aclaracion: dj.Internaciones_Aclaraciones,
      },
      {
        nombre: 'Enfermedades de la piel',
        valor: dj.Enfermedades_de_la_Piel === 1,
        aclaracion: dj.Enfermedades_de_la_Piel_Aclaraciones,
      },
      {
        nombre: '¿Recibió vacunación COVID?',
        valor: dj.Vacunas_COVID === 1,
        aclaracion: dj.Vacunas_COVID_Aclaraciones,
      },
    ];

    // Transform flat clinical items into rows of 2
    const filasClinicas: Array<{
      left: { nombre: string; valor: boolean; aclaracion: string | null };
      right: {
        nombre: string;
        valor: boolean;
        aclaracion: string | null;
      } | null;
    }> = [];
    for (let i = 0; i < itemsClinicos.length; i += 2) {
      filasClinicas.push({
        left: itemsClinicos[i],
        right: itemsClinicos[i + 1] || null,
      });
    }

    const templateData = {
      anio: new Date().getFullYear(),
      fechaFormateada: this.formatDateSimple(new Date()),
      empresa: empresa || '____',
      paciente: {
        apellido: paciente?.Apellido?.toUpperCase() || '',
        nombre: paciente?.Nombre?.toUpperCase() || '',
        dni: paciente?.NroDocumento || '',
        fechaNac: paciente?.FechaNacimiento
          ? this.formatDateSimple(paciente.FechaNacimiento)
          : '',
        telefono: paciente?.Celular1 || paciente?.Telefono || '',
        direccion: paciente?.Direccion || '',
        email: paciente?.Email || '',
        barrio: paciente?.Barrio || '',
        estadoCivil: '',
        localidad: localidad,
        provincia: provincia,
        puestoTrabajo: dj.Ultima_Tarea_Trabajo_Puesto,
      },
      habitos: {
        fuma: dj.Fuma === 1,
        cigarrillos: dj.Cantidad_Cigarros_diarios,
        marihuana: dj.Consume_Marihuana === 1,
        marihuanaAcl: dj.Consume_Marihuana_Aclaraciones,
        cocaina: dj.Consume_Cocaina === 1,
        cocainaAcl: dj.Consume_Cocaina_Aclaraciones,
        alcohol: dj.Consume_Alcohol === 1,
        frecuenciaAlcohol: dj.Frecuencia,
        deportes: dj.Practica_Deportes === 1,
        cualesDeportes: dj.Cuales_Deportes,
        manoHabil: dj.Mano_Habil,
        puesto: dj.Ultima_Tarea_Trabajo_Puesto,
      },
      antecedentes: {
        indemnizacion: dj.Recibio_Indeminizacion_o_tiene_pendiente === 1,
        motivoIndemnizacion:
          dj.Recibio_Indeminizacion_o_tiene_pendiente_Aclaraciones,
      },
      anexoMujer: {
        embarazos:
          !!dj.Cuantos_Embarazos && String(dj.Cuantos_Embarazos) !== '0',
        cantidadEmbarazos: dj.Cuantos_Embarazos,
        abortos:
          !!dj.Abortos_Espontaneos_Cuantos &&
          String(dj.Abortos_Espontaneos_Cuantos) !== '0',
        cantidadAbortos: dj.Abortos_Espontaneos_Cuantos,
        fum:
          paciente?.Genero === 'MASCULINO' || dj.Genero === 'MASCULINO'
            ? ''
            : dj.Fecha_Ultima_Menstruacion
              ? this.formatDateSimple(dj.Fecha_Ultima_Menstruacion)
              : '',
        hormonas: dj.Tratamientos_Hormonales === 1,
        aclaracionHormonas: dj.Tratamientos_Hormonales_Aclaraciones || '',
      },
      filasClinicas: filasClinicas,
      firmaBase64: paciente?.ImagenFirma
        ? `data:image/png;base64,${Buffer.from(paciente.ImagenFirma).toString('base64')}`
        : null,
      logoFooter,
    };

    // 2. Load Template
    const templatePath = path.resolve(__dirname, '..', 'pdfs', 'ddjj.html');
    const templateHtml = fs.readFileSync(templatePath, 'utf8');

    // 3. Compile Handlebars
    const template = handlebars.compile(templateHtml);

    // Register helper
    handlebars.registerHelper('boolToSiNo', (value) => {
      return value ? 'SÍ' : 'NO';
    });
    handlebars.registerHelper('eq', (a, b) => a === b);

    const finalHtml = template(templateData);

    // 4. Puppeteer Render
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Important for containerized envs
    });

    try {
      const page = await browser.newPage();
      await page.setContent(finalHtml, { waitUntil: 'domcontentloaded' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  private formatDateSimple(dateString: string | Date): string {
    if (!dateString) return '';
    // Use shared formatDate utility
    return formatDate(dateString, 'DD/MM/YYYY');
  }
}
