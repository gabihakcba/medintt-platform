import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Query,
  Res,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { Readable } from 'stream';
import {
  ExcelColumn,
  ExcelExportService,
} from '../../common/services/excel-export.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { AtGuard } from '../../common/guards/at.guard';
import { MedicinaLaboralGuard } from '../guards/medicina-laboral.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { PacientesFilterDto } from './dto/pacientes-filter.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@ApiTags('Medicina Laboral - Pacientes')
@Controller('medicina-laboral/pacientes')
@UseGuards(AtGuard, MedicinaLaboralGuard)
@ApiBearerAuth()
export class PacientesController {
  constructor(
    private readonly pacientesService: PacientesService,
    private readonly excelExportService: ExcelExportService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all patients',
    description:
      'Returns all patients if SuperAdmin or Admin of medicina-laboral in medintt org. Returns only patients from user organization if Interlocutor.',
  })
  @ApiResponse({ status: 200, description: 'List of patients' })
  async findAll(
    @GetCurrentUser() user: JwtPayload,
    @Query() filters: PacientesFilterDto,
  ) {
    return this.pacientesService.findAll(user, filters);
  }

  @Get('export/excel')
  @ApiOperation({ summary: 'Export patients/exams to Excel' })
  async exportExcel(
    @GetCurrentUser() user: JwtPayload,
    @Query() filters: PacientesFilterDto,
    @Res() res: Response,
  ) {
    const { data } = await this.pacientesService.findAll(user, filters, true);

    const isExamsExport = filters.includeExamsCount === true;

    let columns: ExcelColumn[] = [];
    let fileName = '';
    let sheetName = '';

    if (isExamsExport) {
      // Exámenes Laborales Export
      columns = [
        { header: 'Apellido', key: 'Apellido', width: 20 },
        { header: 'Nombre', key: 'Nombre', width: 20 },
        { header: 'DNI', key: 'DNI', width: 15 },
        { header: 'Empresa', key: 'Empresa', width: 25 },
        { header: 'Email', key: 'Email', width: 25 },
        { header: 'Cargo', key: 'Cargo', width: 20 },
        { header: 'Puesto', key: 'Puesto', width: 20 },
        { header: 'Cant. Exámenes', key: 'CantExamenes', width: 15 },
      ];
      fileName = 'examenes-laborales';
      sheetName = 'Exámenes Laborales';
    } else {
      // Empleados Export
      columns = [
        { header: 'Apellido', key: 'Apellido', width: 20 },
        { header: 'Nombre', key: 'Nombre', width: 20 },
        { header: 'DNI', key: 'DNI', width: 15 },
        { header: 'Empresa', key: 'Empresa', width: 25 },
        { header: 'Email', key: 'Email', width: 25 },
        { header: 'Cargo', key: 'Cargo', width: 20 },
        { header: 'Puesto', key: 'Puesto', width: 20 },
        { header: 'Firma', key: 'Firma', width: 30 },
      ];
      fileName = 'empleados';
      sheetName = 'Empleados';
    }

    type PatientData = {
      Apellido: string | null;
      Nombre: string | null;
      NroDocumento: string | null;
      Email: string | null;
      Cargo: string | null;
      Puesto: string | null;
      prestatarias: { Nombre: string | null }[];
      examenesCount: number;
      ImagenFirma?: Buffer;
    };

    const excelData = (data as unknown as PatientData[]).map((p) => {
      const empresas =
        p.prestatarias?.map((prep) => prep.Nombre).join(', ') || '';

      let firmaPayload: string | { buffer: Buffer; extension: string } = '';
      if (!isExamsExport && p.ImagenFirma && p.ImagenFirma.length > 0) {
        firmaPayload = {
          buffer: Buffer.from(p.ImagenFirma),
          extension: 'png',
        };
      }

      return {
        Apellido: p.Apellido,
        Nombre: p.Nombre,
        DNI: p.NroDocumento,
        Empresa: empresas,
        Email: p.Email,
        Cargo: p.Cargo,
        Puesto: p.Puesto,
        ...(isExamsExport
          ? { CantExamenes: p.examenesCount || 0 }
          : { Firma: firmaPayload }),
      };
    });

    await this.excelExportService.generateExcel(
      res,
      excelData,
      columns,
      sheetName,
      fileName,
    );
  }

  @Get(':id/firma')
  @ApiOperation({ summary: 'Obtener firma del empleado (PNG)' })
  @ApiResponse({ status: 200, description: 'PNG de la firma' })
  @ApiResponse({ status: 404, description: 'Firma no encontrada' })
  async getSignature(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const signature = await this.pacientesService.getSignature(id);

      res.set({
        'Content-Type': signature.mimeType,
        'Content-Disposition': `inline; filename="${signature.fileName}"`,
      });

      const stream = new Readable();
      stream.push(signature.buffer);
      stream.push(null);

      stream.pipe(res);
    } catch (error) {
      throw new NotFoundException((error as Error).message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update patient information' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateDto: UpdatePacienteDto,
    @GetCurrentUser() user: JwtPayload,
  ) {
    return this.pacientesService.update(id, updateDto, user);
  }

  @Patch(':id/firma')
  @UseGuards(AtGuard, MedicinaLaboralGuard)
  @ApiOperation({ summary: 'Actualizar firma del empleado' })
  @ApiResponse({ status: 200, description: 'Firma actualizada exitosamente' })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos para modificar este paciente',
  })
  async updateSignature(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: import('./dto/update-firma-admin.dto').UpdateFirmaAdminDto,
    @GetCurrentUser() user: JwtPayload,
  ) {
    return await this.pacientesService.updateSignature(id, dto, user);
  }
}
