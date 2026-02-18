import { Controller, Get, UseGuards, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
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
    };

    const excelData = (data as unknown as PatientData[]).map((p) => {
      const empresas =
        p.prestatarias?.map((prep) => prep.Nombre).join(', ') || '';
      return {
        Apellido: p.Apellido,
        Nombre: p.Nombre,
        DNI: p.NroDocumento,
        Empresa: empresas,
        Email: p.Email,
        Cargo: p.Cargo,
        Puesto: p.Puesto,
        ...(isExamsExport && { CantExamenes: p.examenesCount || 0 }),
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
}
