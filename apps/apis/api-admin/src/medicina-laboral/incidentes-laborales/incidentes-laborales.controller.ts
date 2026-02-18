import { Controller, Get, UseGuards, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import {
  ExcelExportService,
  ExcelColumn,
} from '../../common/services/excel-export.service';
import { IncidentesLaboralesFilterDto } from './dto/incidentes-laborales-filter.dto';
import { IncidentesLaboralesService } from './incidentes-laborales.service';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { AtGuard } from '../../common/guards/at.guard';
import { MedicinaLaboralGuard } from '../guards/medicina-laboral.guard';
import type { JwtPayload } from '../../common/types/jwt-payload.type';

@Controller('medicina-laboral/incidentes-laborales')
@UseGuards(AtGuard, MedicinaLaboralGuard)
export class IncidentesLaboralesController {
  constructor(
    private readonly service: IncidentesLaboralesService,
    private readonly excelExportService: ExcelExportService,
  ) {}

  @Get('export/excel')
  async exportExcel(
    @GetCurrentUser() user: JwtPayload,
    @Query() filters: IncidentesLaboralesFilterDto,
    @Res() res: Response,
  ) {
    const { data } = await this.service.findAll(user, filters, true);

    const columns: ExcelColumn[] = [
      { header: 'Fecha', key: 'Fecha', width: 15 },
      { header: 'Prestataria', key: 'Prestataria', width: 25 },
      { header: 'Clase', key: 'Clase', width: 20 },
      { header: 'Paciente', key: 'Paciente', width: 20 },
      { header: 'DNI', key: 'DNI', width: 15 },
      { header: 'Profesional', key: 'Profesional', width: 20 },
      { header: 'Notas', key: 'Notas', width: 30 },
    ];

    type IncidenteExportData = {
      Fecha: Date | null;
      Prestataria: { Nombre: string | null } | null;
      Clase: string | null;
      Paciente: string | null;
      DNI: string | null;
      Profesional: string | null;
      Notas: string | null;
    };

    const excelData = (data as unknown as IncidenteExportData[]).map((i) => ({
      Fecha: i.Fecha ? new Date(i.Fecha).toISOString().split('T')[0] : '',
      Prestataria: i.Prestataria?.Nombre,
      Clase: i.Clase,
      Paciente: i.Paciente,
      DNI: i.DNI,
      Profesional: i.Profesional,
      Notas: i.Notas,
    }));

    await this.excelExportService.generateExcel(
      res,
      excelData,
      columns,
      'Incidentes Laborales',
      'incidentes-laborales',
    );
  }

  @Get()
  findAll(
    @GetCurrentUser() user: JwtPayload,
    @Query() filters: IncidentesLaboralesFilterDto,
  ) {
    return this.service.findAll(user, filters);
  }
}
